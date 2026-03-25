import { 
  GAME_WIDTH, 
  SHIP_WIDTH, 
  SHIP_HEIGHT, 
  SHIP_Y_POS 
} from '../constants'

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
  private isDraggingShip: boolean = false; // 🌟 船を掴んでいるかどうかのフラグ
  private lastX: number = 0;
  private lastY: number = 0;
  public actions: InputAction[] = [];

  constructor(canvas: HTMLCanvasElement) {
    canvas.addEventListener('pointerdown', this.handlePointerDown.bind(this));
    canvas.addEventListener('pointermove', this.handlePointerMove.bind(this));
    window.addEventListener('pointerup', () => { 
      this.isDown = false;
      this.isDraggingShip = false; // 🌟 離したら掴み解除
    });
  }

  private handlePointerDown(e: PointerEvent): void {
    this.isDown = true;
    this.lastX = e.offsetX;
    this.lastY = e.offsetY;

    // 🌟 船の当たり判定チェック
    const isOnShip = (
      e.offsetX >= this.shipX - SHIP_WIDTH / 2 &&
      e.offsetX <= this.shipX + SHIP_WIDTH / 2 &&
      e.offsetY >= SHIP_Y_POS - 20 && // 掴みやすいよう少し判定を上下に広げる
      e.offsetY <= SHIP_Y_POS + SHIP_HEIGHT + 20
    );

    if (isOnShip) {
      this.isDraggingShip = true;
    } else {
      this.isDraggingShip = false;
      // 船を触っていない時だけ攻撃（TAP）を発生させる
      this.actions.push({ type: 'TAP', x: e.offsetX, y: e.offsetY });
    }
  }

  private handlePointerMove(e: PointerEvent): void {
    if (!this.isDown) return;

    if (this.isDraggingShip) {
      this.shipX = e.offsetX;
    } else {
      const dist = Math.hypot(e.offsetX - this.lastX, e.offsetY - this.lastY);
      
      // 🌟 5px から 30px へ引き上げ
      // これにより、ある程度「シュッ」と動かさないとスワイプ判定が出なくなります
      if (dist > 30) { 
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
  }

  public consumeActions(): InputAction[] {
    const currentActions = [...this.actions];
    this.actions = [];
    return currentActions;
  }
}