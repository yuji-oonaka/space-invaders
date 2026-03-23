import { GAME_WIDTH, GAME_HEIGHT, TICK_RATE } from '../constants';

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private lastTime: number = 0;
  private accumulator: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas 2D context を取得できませんでした。');
    this.ctx = context;

    this.initCanvas();
  }

  private initCanvas(): void {
    this.canvas.width = GAME_WIDTH;
    this.canvas.height = GAME_HEIGHT;
  }

  public start(): void {
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop.bind(this));
  }

  private loop(currentTime: number): void {
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    this.accumulator += deltaTime;

    // 固定時間ステップでの更新（FPS低下時でも計算精度を保つ）
    while (this.accumulator >= TICK_RATE) {
      this.update();
      this.accumulator -= TICK_RATE;
    }

    this.render();
    requestAnimationFrame(this.loop.bind(this));
  }

  private update(): void {
    // TODO: ここにゲームロジック（移動、当たり判定）を実装
  }

  private render(): void {
    // 画面のクリア
    this.ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    
    // 背景の描画（確認用）
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // TODO: ここに各エンティティの描画処理を実装
  }
}