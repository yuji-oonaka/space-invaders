import { BaseEntity } from './BaseEntity';
import { COLOR, GHOST_SIZE } from '../constants';
import { lineRectIntersect } from '../utils/math';

export class Ghost extends BaseEntity {
  constructor(x: number, speed: number) {
    super(x, -GHOST_SIZE, GHOST_SIZE, GHOST_SIZE, speed);
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = COLOR.GHOST;
    
    // 幽霊の描画（丸みを帯びた形状）
    ctx.beginPath();
    ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
    ctx.fill();

    // 縦に長い目
    ctx.fillStyle = '#000';
    ctx.fillRect(this.x + 15, this.y + 15, 6, 12);
    ctx.fillRect(this.x + 29, this.y + 15, 6, 12);
  }

  public checkHit(inputX: number, inputY: number, type: 'TAP' | 'SWIPE', startX?: number, startY?: number): boolean {
    // 🌟 ゴーストはスワイプ以外は受け付けない
    if (type !== 'SWIPE') return false;

    // スワイプの軌道（線分）とゴースト（矩形）の交差判定を実行
    if (startX !== undefined && startY !== undefined) {
      return lineRectIntersect(
        startX, startY, inputX, inputY,
        this.x, this.y, this.width, this.height
      );
    }

    return false;
  }
}