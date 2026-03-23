// --- 変更前（デフォルトの内容を全削除し、以下を挿入） ---
import './style.css'
import { Game } from './core/Game';

const init = () => {
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);

  const game = new Game(canvas);
  game.start();
};

window.addEventListener('DOMContentLoaded', init);