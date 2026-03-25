interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; // 0 to 1
  color: string;
}

interface Slash {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  alpha: number; // 透明度
}

export class EffectSystem {
  private particles: Particle[] = [];
  private slashes: Slash[] = []; // 🌟 追加

  // 🌟 斬撃エフェクトを生成するメソッドを追加
  public createSlash(x1: number, y1: number, x2: number, y2: number): void {
    this.slashes.push({ x1, y1, x2, y2, alpha: 1.0 });
  }

  /**
   * 爆発エフェクトを生成
   */
  public createExplosion(x: number, y: number, color: string, count: number = 10): void {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 2;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        color
      });
    }
  }

  public update(): void {
    // 粒子の更新
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.05;
    });
    this.particles = this.particles.filter(p => p.life > 0);

    // 🌟 斬撃の更新（フェードアウト）
    this.slashes.forEach(s => {
      s.alpha -= 0.1; // 徐々に消える
    });
    this.slashes = this.slashes.filter(s => s.alpha > 0);
  }

  public render(ctx: CanvasRenderingContext2D): void {
    // 粒子の描画
    this.particles.forEach(p => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, 4, 4);
    });

    // 🌟 斬撃の描画
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    this.slashes.forEach(s => {
      ctx.globalAlpha = s.alpha;
      ctx.beginPath();
      ctx.moveTo(s.x1, s.y1);
      ctx.lineTo(s.x2, s.y2);
      ctx.stroke();
    });

    ctx.globalAlpha = 1.0;
  }
}

