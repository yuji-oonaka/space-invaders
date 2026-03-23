import { SWIPE_THRESHOLD, SWIPE_TIME_LIMIT, GAME_WIDTH } from '../constants';

export type InputType = 'TAP' | 'SWIPE' | 'NONE';

export class InputHandler {
  public shipX: number = GAME_WIDTH / 2;
  private startX: number = 0;
  private startY: number = 0;
  private startTime: number = 0;
  
  // 外部（Gameクラス等）から読み取るための最新のアクション
  public lastAction: { type: InputType, x: number, y: number } = { type: 'NONE', x: 0, y: 0 };

  constructor(canvas: HTMLCanvasElement) {
    canvas.addEventListener('pointerdown', this.handlePointerDown.bind(this));
    canvas.addEventListener('pointermove', this.handlePointerMove.bind(this));
    canvas.addEventListener('pointerup', this.handlePointerUp.bind(this));
  }

  private handlePointerDown(e: PointerEvent): void {
    this.startX = e.offsetX;
    this.startY = e.offsetY;
    this.startTime = performance.now();
    this.shipX = e.offsetX; // タップした瞬間に船がその位置へ
  }

  private handlePointerMove(e: PointerEvent): void {
    this.shipX = e.offsetX; // スライド中は常に船が追従
  }

  private handlePointerUp(e: PointerEvent): void {
    const endX = e.offsetX;
    const endY = e.offsetY;
    const duration = performance.now() - this.startTime;
    const dist = Math.hypot(endX - this.startX, endY - this.startY);

    if (dist > SWIPE_THRESHOLD && duration < SWIPE_TIME_LIMIT) {
      this.lastAction = { type: 'SWIPE', x: endX, y: endY };
    } else {
      this.lastAction = { type: 'TAP', x: endX, y: endY };
    }
    
    // 判定消費用のフラグセット（後ほどGameループでリセット）
  }

  public consumeAction(): void {
    this.lastAction = { type: 'NONE', x: 0, y: 0 };
  }
}