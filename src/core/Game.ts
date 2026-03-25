import { EntityManager } from '../systems/EntityManager';
import { InputHandler } from './InputHandler';
import { 
  GAME_WIDTH, 
  GAME_HEIGHT, 
  TICK_RATE 
} from '../constants';

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private entityManager: EntityManager;
  private input: InputHandler;

  // ループ管理用プロパティ
  private lastTime: number = 0;
  private accumulator: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas 2D context を取得できませんでした。');
    this.ctx = context;

    // 各システムの初期化
    this.input = new InputHandler(canvas);
    this.entityManager = new EntityManager();
    
    this.initCanvas();
  }

  /**
   * キャンバスの解像度を定数に基づいて設定
   */
  private initCanvas(): void {
    this.canvas.width = GAME_WIDTH;
    this.canvas.height = GAME_HEIGHT;
  }

  /**
   * ゲームループの開始
   */
  public start(): void {
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop.bind(this));
  }

  /**
   * メインループ（固定時間ステップ形式）
   */
  private loop(currentTime: number): void {
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    this.accumulator += deltaTime;

    // フレームレートに依存せず計算精度を保つための固定更新
    while (this.accumulator >= TICK_RATE) {
      this.update();
      this.accumulator -= TICK_RATE;
    }

    this.render();
    requestAnimationFrame(this.loop.bind(this));
  }

  /**
   * 状態更新ロジック
   */
  private update(): void {
    // 溜まった全アクションを取得
    const actions = this.input.consumeActions();
    
    actions.forEach(action => {
      // 🌟 修正ポイント: 'NONE' の場合は処理をスキップ（型の絞り込み）
      if (action.type === 'NONE') return;

      this.entityManager.handleInput(
        action.x, 
        action.y, 
        action.type, // ここで型エラーが消えます
        action.startX, 
        action.startY
      );
    });

    // 定数 TICK_RATE（16.6ms相当）を渡して更新
    this.entityManager.update(TICK_RATE);
  }

  /**
   * 描画ロジック
   */
  private render(): void {
    // 1. 背景のクリア（残像防止）
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // 2. エンティティ全体の描画を委譲
    this.entityManager.render(this.ctx);
  }
}