import { GAME_WIDTH } from '../constants';

export type InputType = 'TAP' | 'SWIPE' | 'NONE';

export type InputAction = { 
  type: InputType, 
  x: number, 
  y: number, 
  startX?: number, 
  startY?: number 
};

export class InputHandler {
  public shipX: number = GAME_WIDTH / 2;
  private isDown: boolean = false;
  private lastX: number = 0;
  private lastY: number = 0;
  
  // 🌟 配列にして、1フレームに発生した複数のアクション（連続スワイプ等）を保持できるようにする
  public actions: InputAction[] = [];

  constructor(canvas: HTMLCanvasElement) {
    canvas.addEventListener('pointerdown', this.handlePointerDown.bind(this));
    canvas.addEventListener('pointermove', this.handlePointerMove.bind(this));
    window.addEventListener('pointerup', () => { this.isDown = false; });
  }

  private handlePointerDown(e: PointerEvent): void {
    this.isDown = true;
    this.lastX = e.offsetX;
    this.lastY = e.offsetY;
    this.shipX = e.offsetX;

    // 🌟 押した瞬間に TAP 判定を発生させる
    this.actions.push({ type: 'TAP', x: e.offsetX, y: e.offsetY });
  }

  private handlePointerMove(e: PointerEvent): void {
    this.shipX = e.offsetX;
    if (!this.isDown) return;

    const dist = Math.hypot(e.offsetX - this.lastX, e.offsetY - this.lastY);
    
    // 🌟 5px以上動いたら「斬撃セグメント」として判定
    if (dist > 5) {
      this.actions.push({ 
        type: 'SWIPE', 
        x: e.offsetX, 
        y: e.offsetY, 
        startX: this.lastX, 
        startY: this.lastY 
      });
      this.lastX = e.offsetX;
      this.lastY = e.offsetY;
    }
  }

  public consumeActions(): InputAction[] {
    const currentActions = [...this.actions];
    this.actions = [];
    return currentActions;
  }
}