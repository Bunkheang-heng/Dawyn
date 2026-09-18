import { burst, launchConfetti } from './effects.js';

export function initCake() {
  const cakeStage = document.getElementById('cake-stage');
  const cakeLede = document.getElementById('cake-lede');
  const relightBtn = document.getElementById('relight-btn');
  let cakeBlown = false;

  function blowCake() {
    if (cakeBlown) return;
    cakeBlown = true;
    cakeStage.classList.add('is-blown');
    cakeLede.textContent = 'Wish granted. Happy birthday, Unc.nhii.';
    relightBtn.hidden = false;
    burst(cakeStage, 16);
    setTimeout(launchConfetti, 200);
  }

  function relightCake(e) {
    e?.stopPropagation();
    cakeBlown = false;
    cakeStage.classList.remove('is-blown');
    cakeLede.textContent = 'Tap the cake. Wish hard.';
    relightBtn.hidden = true;
    burst(cakeStage, 8);
  }

  cakeStage.addEventListener('click', blowCake);
  relightBtn.addEventListener('click', relightCake);
}
