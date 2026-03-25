import { BaseEntity } from '../entities/BaseEntity';
import { Oni } from '../entities/Oni';
import { Ghost } from '../entities/Ghost';
import { Ally } from '../entities/Ally';
import { Ship } from '../entities/Ship';
import { EffectSystem } from './EffectSystem';
import { ScoreSystem } from './ScoreSystem';
import { 
  GAME_WIDTH, 
  GAME_HEIGHT, 
  SPAWN_INTERVAL, 
  SPAWN_CHANCE_GHOST,
  SPAWN_CHANCE_ALLY,
  SCORE,
  COLOR,
  UI_TOP_HEIGHT
} from '../constants';

export class EntityManager {
  private entities: BaseEntity[] = [];
  private ship: Ship = new Ship();
  private effectSystem: EffectSystem = new EffectSystem();
  public scoreSystem: ScoreSystem = new ScoreSystem();
  private spawnTimer: number = 0;

  public update(deltaTime: number, shipX: number): void {
    this.spawnTimer += deltaTime;
    if (this.spawnTimer > SPAWN_INTERVAL) {
      this.spawn();
      this.spawnTimer = 0;
    }

    this.ship.update(shipX);
    this.scoreSystem.update(); // 🌟 コンボタイマーの更新
    this.effectSystem.update();

    this.entities.forEach(e => {
      e.update();
      
      // 1. 枠の下端（GAME_HEIGHT）に到達したかの判定
      if (e.y >= GAME_HEIGHT && !e.isDead) {
        this.scoreSystem.decreaseLife(); // 敵も味方も逃したらライフ減
        this.effectSystem.triggerFlash();
        e.isDead = true; 
      }

      // 2. 船によるキャッチ判定（味方のみ）
      if (e instanceof Ally && !e.isDead && this.checkShipCollision(e)) {
        e.isDead = true;
        this.scoreSystem.addScore(SCORE.ALLY_CATCH);
        this.effectSystem.createExplosion(e.x + e.width/2, e.y + e.height/2, '#FFFFFF', 20);
      }
    });

    this.entities = this.entities.filter(e => !e.isDead);
  }

  public render(ctx: CanvasRenderingContext2D): void {
    // --- ゲームエリアの描画 ---
    ctx.save();
    
    // 🌟 枠内だけを描画する設定（これでUIエリアにはみ出しません）
    ctx.beginPath();
    ctx.rect(10, UI_TOP_HEIGHT, GAME_WIDTH - 20, GAME_HEIGHT - UI_TOP_HEIGHT - 10);
    ctx.clip(); 

    this.ship.render(ctx);
    this.entities.forEach(e => e.render(ctx));
    this.effectSystem.render(ctx);
    
    ctx.restore();

    // --- UIエリアの描画（クリッピングの影響を受けないよう最後に描画） ---
    this.scoreSystem.render(ctx); 
  }

  public handleInput(x: number, y: number, type: 'TAP' | 'SWIPE', startX?: number, startY?: number): void {
    // 枠外（スコアエリア）でのクリックは無視
    if (y < UI_TOP_HEIGHT) return;

    if (type === 'TAP') {
      this.effectSystem.createExplosion(x, y, '#444444', 3);
    } else if (type === 'SWIPE' && startX !== undefined && startY !== undefined) {
      this.effectSystem.createSlash(startX, startY, x, y);
    }

    this.entities.forEach(entity => {
      if (entity.isDead) return;

      if (entity.checkHit(x, y, type, startX, startY)) {
        entity.isDead = true;
        if (entity instanceof Ally) {
          this.scoreSystem.resetCombo();
          this.scoreSystem.score += SCORE.ALLY_MISTAKE;
          this.effectSystem.createExplosion(entity.x + entity.width/2, entity.y + entity.height/2, '#666666', 8);
        } else {
          const points = entity instanceof Oni ? SCORE.ONI : SCORE.GHOST;
          this.scoreSystem.addScore(points);
          const color = entity instanceof Oni ? COLOR.ONI : COLOR.GHOST;
          this.effectSystem.createExplosion(entity.x + entity.width/2, entity.y + entity.height/2, color, 15);
        }
      }
    });
  }

  private spawn(): void {
    // 🌟 枠内に収まるようにX座標を計算
    const x = 20 + Math.random() * (GAME_WIDTH - 80);
    const startY = UI_TOP_HEIGHT; // 🌟 枠の最上部

    const rand = Math.random();
    if (rand < SPAWN_CHANCE_ALLY) {
      const ally = new Ally(x, 1.2);
      ally.y = startY - ally.height; // 🌟 枠の境界線から出現
      this.entities.push(ally);
    } else if (rand < SPAWN_CHANCE_ALLY + SPAWN_CHANCE_GHOST) {
      const ghost = new Ghost(x, 1.5);
      ghost.y = startY - ghost.height; // 🌟 枠の境界線から出現
      this.entities.push(ghost);
    } else {
      const oni = new Oni(x, 2);
      oni.y = startY - oni.height; // 🌟 枠の境界線から出現
      this.entities.push(oni);
    }
  }

  private checkShipCollision(e: BaseEntity): boolean {
    return (
      e.x < this.ship.x + this.ship.width &&
      e.x + e.width > this.ship.x &&
      e.y < this.ship.y + this.ship.height &&
      e.y + e.height > this.ship.y
    );
  }
}