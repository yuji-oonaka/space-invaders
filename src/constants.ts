// src/constants.ts
export const GAME_WIDTH = 360; // iPhone SE等の最小幅に合わせる
export const GAME_HEIGHT = 640; // 9:16のアスペクト比

export const FPS = 60;
export const TICK_RATE = 1000 / FPS;

// 入力判定
export const SWIPE_THRESHOLD = 30; // これ以上動かしたらスワイプ
export const SWIPE_TIME_LIMIT = 500; // 300ms以内ならスワイプとみなす
export const SLASH_DURATION = 200;

// エンティティ設定
export const ONI_SIZE = 50;
export const GHOST_SIZE = 50;
export const ALLY_SIZE = 30;
export const SPAWN_CHANCE_ALLY = 0.15; // 15%の確率で出現
export const COLOR_ALLY = '#FFFF00';
export const SHIP_WIDTH = 60;
export const SHIP_HEIGHT = 15;
export const SHIP_Y_POS = GAME_HEIGHT - 60;

export const SPAWN_INTERVAL = 1000;

export const COLOR = {
  ONI: '#FF4444',
  GHOST: '#AA88FF',
  ALLY: '#FFFF44',
  SHIP: '#00FF00',
  UI: '#FFFFFF',
} as const;

export const GHOST_SPEED_BASE = 1.5; // 鬼より少しゆっくり、または速くしてリズムをずらす
export const SPAWN_CHANCE_GHOST = 0.3; // 30%の確率で幽霊が出現

export const SCORE = {
  ONI: 100,
  GHOST: 200,
  ALLY_CATCH: 500,
  ALLY_MISTAKE: -1000, // 味方を叩いた時のペナルティ
} as const;

export const COMBO_TIME_LIMIT = 2000; // 2秒以内に次を倒せばコンボ継続

export const UI_TOP_HEIGHT = 80;    // 上部スコアエリアの高さ
export const FIELD_PADDING = 10;   // 左右の隙間
export const COLOR_UI_BG = '#1a1a2e'; // 濃い紺色（メジャーゲームっぽい色）
export const COLOR_FIELD_BG = '#000000'; // プレイエリアは黒