export class ScoreSystem {
  public score: number = 0;
  public combo: number = 0;
  public maxCombo: number = 0;

  /**
   * スコア加算（コンボ倍率を適用）
   */
  public addScore(basePoint: number): void {
    this.combo++;
    if (this.combo > this.maxCombo) this.maxCombo = this.combo;

    // コンボ数に応じたボーナス（例：10コンボごとに倍率アップ）
    const multiplier = 1 + Math.floor(this.combo / 10) * 0.5;
    this.score += Math.floor(basePoint * multiplier);
  }

  /**
   * コンボリセット（ミス時や味方殺害時）
   */
  public resetCombo(): void {
    this.combo = 0;
  }

 public render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    
    // --- 1. 上部UIパネルの背景 ---
    ctx.fillStyle = '#222244'; // 少し明るい紺
    ctx.fillRect(0, 0, 360, 80); // 上部パネル
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.strokeRect(5, 5, 350, 70); // 内枠

    // --- 2. スコア表示 (画像のようなカプセル風) ---
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.roundRect(80, 15, 200, 40, 20); // 中央のスコア枠
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('スコア', 180, 30); // ラベル

    ctx.font = 'bold 24px monospace';
    ctx.fillText(this.score.toString().padStart(8, '0'), 180, 50); // 8桁表示

    // --- 3. Lv表示 (左上のボックス) ---
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(10, 15, 50, 50);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('Lv.', 35, 30);
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('5', 35, 55); // とりあえず固定値

    // --- 4. コンボ表示 (プレイエリア内に浮かせる) ---
    if (this.combo >= 2) {
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 4;
      ctx.fillStyle = '#FFFF00';
      ctx.font = 'italic bold 32px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${this.combo} れんさ！`, 180, 200); // 日本語にすると雰囲気出ます
    }

    ctx.restore();
  }
}