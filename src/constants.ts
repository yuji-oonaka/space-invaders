// src/constants.ts
export const GAME_WIDTH = 360; // iPhone SE等の最小幅に合わせる
export const GAME_HEIGHT = 640; // 9:16のアスペクト比

export const FPS = 60;
export const TICK_RATE = 1000 / FPS;

// 入力判定
export const SWIPE_THRESHOLD = 30; // これ以上動かしたらスワイプ
export const SWIPE_TIME_LIMIT = 300; // 300ms以内ならスワイプとみなす

// エンティティ設定
export const ONI_SIZE = 50;
export const GHOST_SIZE = 50;
export const ALLY_SIZE = 40;
export const SHIP_WIDTH = 80;
export const SHIP_HEIGHT = 20;

export const SPAWN_INTERVAL = 1000;

export const COLOR = {
  ONI: '#FF4444',
  GHOST: '#AA88FF',
  ALLY: '#FFFF44',
  SHIP: '#00FF00',
  UI: '#FFFFFF',
} as const;