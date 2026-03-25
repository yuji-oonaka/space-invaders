import { INITIAL_LIVES } from '../constants';

export class ScoreSystem {
  public score: number = 0;
  public combo: number = 0;
  public maxCombo: number = 0;
  public lives: number = INITIAL_LIVES;
  public isGameOver: boolean = false;
  private comboTimer: number = 0;

  /**
   * スコア加算（コンボ倍率を適用）
   */
  public addScore(basePoint: number): void {
    this.combo++;
    if (this.combo > this.maxCombo) this.maxCombo = this.combo;
    
    this.comboTimer = 60; // 🌟 1秒間（60フレーム）表示するように設定

    const multiplier = 1 + Math.floor(this.combo / 10) * 0.5;
    this.score += Math.floor(basePoint * multiplier);
  }

  /**
   * コンボリセット（ミス時や味方殺害時）
   */
  public resetCombo(): void {
    this.combo = 0;
  }
    
  public decreaseLife(): void {
    if (this.isGameOver) return;
    this.lives--;
    this.combo = 0; // ライフが減るときはコンボも切る
    if (this.lives <= 0) {
      this.isGameOver = true;
    }
  }

  public update(): void {
    // 🌟 タイマーを減らす
    if (this.comboTimer > 0) {
      this.comboTimer--;
    }
  }

 public render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.globalAlpha = 1.0;

    // --- スコア表示 ---
    // (前回のレイアウトを維持)
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`SCORE: ${this.score.toLocaleString()}`, 110, 45);

    // --- 🌟 ライフ（ハート）表示 ---
    ctx.font = '24px serif';
    let hearts = '';
    for (let i = 0; i < INITIAL_LIVES; i++) {
      hearts += i < this.lives ? '❤️' : '🖤'; // 残機をハート、失った分を黒ハートで表現
    }
    ctx.textAlign = 'right';
    ctx.fillText(hearts, 340, 45);

    // --- コンボ表示 ---
    if (this.combo >= 2 && this.comboTimer > 0) {
      // 徐々に消える（フェードアウト）演出
      ctx.globalAlpha = Math.min(1, this.comboTimer / 20); 
      
      ctx.fillStyle = '#FFFF00';
      ctx.font = 'italic bold 32px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${this.combo} れんさ！`, 180, 250); // 邪魔にならない位置に
    }

    // --- 🌟 ゲームオーバー表示 ---
    if (this.isGameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, 360, 640);
      ctx.fillStyle = '#FF0000';
      ctx.font = 'bold 40px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', 180, 320);
      ctx.font = '20px sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('リロードして再挑戦', 180, 370);
    }

    ctx.restore();
  }
}