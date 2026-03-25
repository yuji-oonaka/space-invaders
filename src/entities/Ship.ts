import { SHIP_WIDTH, SHIP_HEIGHT, SHIP_Y_POS, COLOR } from '../constants';

export class Ship {
  public x: number = 0;
  public y: number = SHIP_Y_POS;
  public width: number = SHIP_WIDTH;
  public height: number = SHIP_HEIGHT;

  /**
   * 船の位置を更新（ターゲット座標へ追従）
   */
  public update(targetX: number): void {
    // 船の中心が指の位置に来るように調整
    this.x = targetX - this.width / 2;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = COLOR.SHIP;
    
    // 船の描画（シンプルな皿のような形）
    ctx.beginPath();
    ctx.roundRect(this.x, this.y, this.width, this.height, 5);
    ctx.fill();

    // 船の上の飾り（キャッチしそうな雰囲気）
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x + 5, this.y - 5, this.width - 10, 5);
  }
}