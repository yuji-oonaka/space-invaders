import { BaseEntity } from './BaseEntity';
import { ALLY_SIZE, COLOR_ALLY } from '../constants';

export class Ally extends BaseEntity {
  constructor(x: number, speed: number) {
    super(x, -ALLY_SIZE, ALLY_SIZE, ALLY_SIZE, speed);
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = COLOR_ALLY;
    // 味方の描画（丸っこい、または動物のような形）
    ctx.beginPath();
    ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
    ctx.fill();

    // 助けてほしそうな目
    ctx.fillStyle = '#000';
    ctx.fillRect(this.x + 8, this.y + 10, 4, 4);
    ctx.fillRect(this.x + 18, this.y + 10, 4, 4);
  }

  public checkHit(inputX: number, inputY: number, _type: 'TAP' | 'SWIPE'): boolean {
    // 🌟 憲法：味方を攻撃してしまった判定
    // 範囲内をタップまたはスワイプされたら「誤爆」として true を返す
    return (
      inputX >= this.x &&
      inputX <= this.x + this.width &&
      inputY >= this.y &&
      inputY <= this.y + this.height
    );
  }
}