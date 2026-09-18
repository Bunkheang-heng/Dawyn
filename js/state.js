/* Shared app state */
export const TOTAL = 5;
export const LABELS = ['Welcome', 'Memories', 'Wish', 'Gift', 'Letter'];

export const state = {
  chapter: 0,
  opened: false,
  reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
};
