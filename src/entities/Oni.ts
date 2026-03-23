// src/entities/Oni.ts
import { BaseEntity } from './BaseEntity';
import { COLOR, ONI_SIZE } from '../constants';

export class Oni extends BaseEntity {
  constructor(x: number, speed: number) {
    super(x, -ONI_SIZE, ONI_SIZE, ONI_SIZE, speed);
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = COLOR.ONI;
    // 鬼の簡易表現（角付きの四角）
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = '#000'; // 目
    ctx.fillRect(this.x + 10, this.y + 10, 8, 8);
    ctx.fillRect(this.x + 32, this.y + 10, 8, 8);
  }

  public checkHit(inputX: number, inputY: number, type: string): boolean {
    if (type !== 'TAP') return false;

    return (
      inputX >= this.x &&
      inputX <= this.x + this.width &&
      inputY >= this.y &&
      inputY <= this.y + this.height
    );
  }
}