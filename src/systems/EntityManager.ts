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

export class EntityManager {
  private entities: BaseEntity[] = [];
  private spawnTimer: number = 0;
  private effectSystem: EffectSystem = new EffectSystem();

  public update(deltaTime: number): void {
    this.spawnTimer += deltaTime;
    if (this.spawnTimer > SPAWN_INTERVAL) {
      this.spawn();
      this.spawnTimer = 0;
    }

    this.entities.forEach(e => e.update());
    this.effectSystem.update();
    this.entities = this.entities.filter(e => !e.isDead && e.y < GAME_HEIGHT);
  }

  public render(ctx: CanvasRenderingContext2D): void {
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
  }

  private spawn(): void {
    const x = Math.random() * (GAME_WIDTH - 50);
    if (Math.random() < SPAWN_CHANCE_GHOST) {
      this.entities.push(new Ghost(x, 1.5));
    } else {
      this.entities.push(new Oni(x, 2));
    }
  }
}