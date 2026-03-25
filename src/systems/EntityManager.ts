import { BaseEntity } from '../entities/BaseEntity';
import { Oni } from '../entities/Oni';
import { Ghost } from '../entities/Ghost';
import { 
  GAME_WIDTH, 
  GAME_HEIGHT, 
  SPAWN_INTERVAL, 
  SPAWN_CHANCE_GHOST 
} from '../constants';
import { EffectSystem } from './EffectSystem'; // 🌟 追加
import { COLOR } from '../constants';
import { Ship } from '../entities/Ship';
import { Ally } from '../entities/Ally'; // 🌟 追加
import { SPAWN_CHANCE_ALLY} from '../constants'; // 🌟 追加

export class EntityManager {
  private entities: BaseEntity[] = [];
  private ship: Ship = new Ship(); // 🌟 船をインスタンス化
  private spawnTimer: number = 0;
  private effectSystem: EffectSystem = new EffectSystem();

  // 🌟 引数に shipX を追加
  public update(deltaTime: number, shipX: number): void {
    // 既存の生成ロジック
    this.spawnTimer += deltaTime;
    if (this.spawnTimer > SPAWN_INTERVAL) {
      this.spawn();
      this.spawnTimer = 0;
    }

    this.ship.update(shipX);
    this.effectSystem.update();

    this.entities.forEach(e => {
      e.update();

      // 🌟 味方のキャッチ判定（Ship vs Ally）
      if (e instanceof Ally && !e.isDead) {
        if (
          e.x < this.ship.x + this.ship.width &&
          e.x + e.width > this.ship.x &&
          e.y < this.ship.y + this.ship.height &&
          e.y + e.height > this.ship.y
        ) {
          e.isDead = true;
          // キャッチ成功エフェクト
          this.effectSystem.createExplosion(e.x + e.width/2, e.y + e.height/2, '#FFFFFF', 20);
          console.log("CATCH SUCCESS!");
        }
      }
    });

    this.entities = this.entities.filter(e => !e.isDead && e.y < GAME_HEIGHT);
  }

  public render(ctx: CanvasRenderingContext2D): void {
    this.ship.render(ctx); // 🌟 船の描画（敵より先に描くか後に描くかはお好みで）
    this.entities.forEach(e => e.render(ctx));
    this.effectSystem.render(ctx);
  }

  public handleInput(x: number, y: number, type: 'TAP' | 'SWIPE', startX?: number, startY?: number): void {
    // 🌟 空振りでもエフェクトを出す（視覚的フィードバック）
    if (type === 'TAP') {
      this.effectSystem.createExplosion(x, y, '#444444', 3); // 弱い波紋
    } else if (type === 'SWIPE' && startX !== undefined && startY !== undefined) {
      this.effectSystem.createSlash(startX, startY, x, y);
    }

    this.entities.forEach(entity => {
      if (entity.checkHit(x, y, type, startX, startY)) {
        entity.isDead = true;
        
        // 撃破時は派手なエフェクト
        const color = entity instanceof Oni ? COLOR.ONI : COLOR.GHOST;
        this.effectSystem.createExplosion(
          entity.x + entity.width / 2, 
          entity.y + entity.height / 2, 
          color,
          15
        );
      }
    });
    this.entities.forEach(entity => {
      if (entity.checkHit(x, y, type, startX, startY)) {
        entity.isDead = true;
        
        if (entity instanceof Ally) {
          // 🌟 味方を攻撃してしまった（ミス）
          this.effectSystem.createExplosion(entity.x + entity.width/2, entity.y + entity.height/2, '#666666', 5);
          console.log("ALLY KILL... MISTAKE!");
        } else {
          // 敵を倒した
          const color = entity instanceof Oni ? COLOR.ONI : COLOR.GHOST;
          this.effectSystem.createExplosion(entity.x + entity.width/2, entity.y + entity.height/2, color, 15);
        }
      }
    });
  }

  private spawn(): void {
    const x = Math.random() * (GAME_WIDTH - 50);
    const rand = Math.random();
    
    // 🌟 敵と味方の振り分け
    if (rand < SPAWN_CHANCE_ALLY) {
      this.entities.push(new Ally(x, 1.2)); // 味方は少しゆっくり
    } else if (rand < SPAWN_CHANCE_ALLY + SPAWN_CHANCE_GHOST) {
      this.entities.push(new Ghost(x, 1.5));
    } else {
      this.entities.push(new Oni(x, 2));
    }
  }
}