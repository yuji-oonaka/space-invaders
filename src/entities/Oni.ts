import { BaseEntity } from './BaseEntity';
import { COLOR, ONI_SIZE } from '../constants';

export class Oni extends BaseEntity {
  constructor(x: number, speed: number) {
    super(x, -ONI_SIZE, ONI_SIZE, ONI_SIZE, speed);
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = COLOR.ONI;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // 角の描画
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.moveTo(this.x + 10, this.y);
    ctx.lineTo(this.x + 25, this.y - 15);
    ctx.lineTo(this.x + 40, this.y);
    ctx.fill();
  }

  public checkHit(inputX: number, inputY: number, type: 'TAP' | 'SWIPE'): boolean {
    // 🌟 鬼はタップ以外（スワイプなど）は無視する
    if (type !== 'TAP') return false;

    return (
      inputX >= this.x && 
      inputX <= this.x + this.width && 
      inputY >= this.y && 
      inputY <= this.y + this.height
    );
  }
}