import { burst, launchConfetti } from './effects.js';

export function initGift() {
  const giftBoard = document.getElementById('gift-board');
  const present = document.getElementById('present');
  const wishLive = document.getElementById('wish-live');
  const giftLede = document.getElementById('gift-lede');
  const rewrapBtn = document.getElementById('rewrap-btn');
  const picked = new Set();

  function openPresent() {
    if (giftBoard.classList.contains('is-open')) return;
    giftBoard.classList.add('is-open');
    giftLede.textContent = 'Collect every wish from the garden.';
    burst(present, 14);
    setTimeout(launchConfetti, 250);
    if (window.innerWidth < 900) {
      setTimeout(() => {
        const panel = document.getElementById('wish-panel');
        const scroller = document.querySelector('#ch-3 .chapter-inner');
        if (panel && scroller) {
          scroller.scrollTo({ top: panel.offsetTop - 20, behavior: 'smooth' });
        }
      }, 400);
    }
  }

  function closePresent() {
    giftBoard.classList.remove('is-open');
    giftLede.textContent = 'Tap the box. Then collect every wish.';
    wishLive.textContent = 'Choose a bloom for a secret wish.';
    picked.clear();
    document.querySelectorAll('.wish').forEach(w => w.classList.remove('is-picked'));
    burst(present, 6);
  }

  present.addEventListener('click', openPresent);
  rewrapBtn.addEventListener('click', closePresent);

  document.querySelectorAll('.wish').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!giftBoard.classList.contains('is-open')) openPresent();
      const name = btn.dataset.name;
      const msg = btn.dataset.msg;
      const icon = btn.dataset.icon;
      wishLive.textContent = `${icon} ${name} — “${msg}”`;
      btn.classList.add('is-picked');
      picked.add(name);
      burst(btn, 8);
      if (picked.size === document.querySelectorAll('.wish').length) {
        wishLive.textContent = 'Every bloom opened — a full garden of wishes for you.';
        launchConfetti();
      }
    });
  });
}
