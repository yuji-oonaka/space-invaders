// src/entities/BaseEntity.ts
export abstract class BaseEntity {
  public isDead: boolean = false;
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public speed: number;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    speed: number
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
  }

  public update(): void {
    this.y += this.speed;
  }

  abstract render(ctx: CanvasRenderingContext2D): void;
  
  // 🌟 引数に startX, startY を追加して、Ghostがスワイプ座標を受け取れるようにする
  abstract checkHit(
    inputX: number, 
    inputY: number, 
    type: 'TAP' | 'SWIPE', 
    startX?: number, 
    startY?: number
  ): boolean;
}