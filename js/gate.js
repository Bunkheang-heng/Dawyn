import { state } from './state.js';
import { launchConfetti } from './effects.js';
import { playMusic } from './music.js';

export function initGate() {
  const gate = document.getElementById('gate');
  document.getElementById('gate-open').addEventListener('click', () => {
    state.opened = true;
    gate.classList.add('is-open');
    document.body.classList.add('is-open');
    playMusic();
    setTimeout(launchConfetti, 500);
    setTimeout(() => {
      gate.style.display = 'none';
    }, 1300);
  });
}
