// 1. インポートの追加
import { BaseEntity } from '../entities/BaseEntity';
import { Oni } from '../entities/Oni';
import { InputHandler } from './InputHandler';
import { GAME_WIDTH, GAME_HEIGHT, SPAWN_INTERVAL, TICK_RATE } from '../constants';

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D; // 🌟 挿入：ここが漏れていました
  private entities: BaseEntity[] = [];
  private input: InputHandler;
  private spawnTimer: number = 0;
  private lastTime: number = 0;          // 🌟 挿入：ループ管理用
  private accumulator: number = 0;     // 🌟 挿入：ループ管理用

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas 2D context を取得できませんでした。');
    this.ctx = context; // これで this.ctx が使えるようになります
    
    this.input = new InputHandler(canvas);
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

    while (this.accumulator >= TICK_RATE) {
      this.update(); // 🌟 ここで呼び出すことで「未使用」エラーが消えます
      this.accumulator -= TICK_RATE;
    }

    this.render();   // 🌟 ここで呼び出すことで「未使用」エラーが消えます
    requestAnimationFrame(this.loop.bind(this));
  }

  private update(): void {
    // 敵の生成ロジック（簡易版）
    this.spawnTimer += 16.6; // 約1フレーム分
    if (this.spawnTimer > SPAWN_INTERVAL) {
      const x = Math.random() * (GAME_WIDTH - 50);
      this.entities.push(new Oni(x, 2));
      this.spawnTimer = 0;
    }

    // 入力判定
    const { type, x, y } = this.input.lastAction;
    if (type !== 'NONE') {
      this.entities.forEach(entity => {
        if (entity.checkHit(x, y, type)) {
          entity.isDead = true;
          // ここにスコア加算やSE再生を入れる
        }
      });
      this.input.consumeAction(); // 判定を1回で消費
    }

    // 更新とクリーンアップ
    this.entities.forEach(e => e.update());
    this.entities = this.entities.filter(e => !e.isDead && e.y < GAME_HEIGHT);
  }

  private render(): void {
    // 🌟 画面全体を黒で塗りつぶして、前のフレームの描画をリセットする
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // エンティティ（鬼など）を新しい位置に描画
    this.entities.forEach(e => e.render(this.ctx));
  }
}