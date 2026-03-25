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
    if (type !== 'SWIPE') return false;

    if (startX !== undefined && startY !== undefined) {
      // 🌟 追加：横方向へのスワイプ距離を計算
      const horizontalDist = Math.abs(inputX - startX);
      
      // 🌟 横に 25px 以上動いていないスワイプは「斬撃」と認めない（ズバッ！じゃない）
      if (horizontalDist < 25) return false;

      // 軌道と矩形の交差判定
      return lineRectIntersect(
        startX, startY, inputX, inputY,
        this.x, this.y, this.width, this.height
      );
    }

    return false;
  }
}