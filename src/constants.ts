// src/constants.ts
export const GAME_WIDTH = 360; // iPhone SE等の最小幅に合わせる
export const GAME_HEIGHT = 640; // 9:16のアスペクト比

export const FPS = 60;
export const TICK_RATE = 1000 / FPS;

export const COLOR = {
  PLAYER: '#00FF00',
  INVADER: '#FFFFFF',
  BULLET: '#FFFFFF',
  UI: '#FFFFFF',
} as const;