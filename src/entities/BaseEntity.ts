// src/entities/BaseEntity.ts
export abstract class BaseEntity {
  public isDead: boolean = false;

  // 🌟 プロパティを明示的に宣言
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
    // 🌟 愚直に代入する形に変更
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
  
  abstract checkHit(inputX: number, inputY: number, type: 'TAP' | 'SWIPE'): boolean;
}