// Shared constants across the application

export const ANIMATION_DURATION = {
  FAST: 150,
  DEFAULT: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
} as const;

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

export const Z_INDEX = {
  PARTICLES: -10,
  BASE: 0,
  DROPDOWN: 10,
  STICKY: 20,
  MODAL_BACKDROP: 40,
  MODAL: 50,
  TOOLTIP: 60,
} as const;
