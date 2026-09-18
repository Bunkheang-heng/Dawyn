import { burst, launchConfetti } from './effects.js';

const LILY_SVG = `
<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="petalA" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FFD6E0"/>
      <stop offset="55%" stop-color="#F4A0B4"/>
      <stop offset="100%" stop-color="#D45C7A"/>
    </linearGradient>
    <linearGradient id="petalB" x1="1" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFE3EB"/>
      <stop offset="100%" stop-color="#E87898"/>
    </linearGradient>
  </defs>
  <path d="M40 72 C36 58 34 48 40 28 C46 48 44 58 40 72Z" fill="#5A8F4A"/>
  <ellipse cx="40" cy="34" rx="7" ry="18" fill="url(#petalA)" transform="rotate(0 40 34)"/>
  <ellipse cx="40" cy="34" rx="7" ry="18" fill="url(#petalB)" transform="rotate(55 40 34)" opacity="0.95"/>
  <ellipse cx="40" cy="34" rx="7" ry="18" fill="url(#petalA)" transform="rotate(110 40 34)" opacity="0.92"/>
  <ellipse cx="40" cy="34" rx="7" ry="18" fill="url(#petalB)" transform="rotate(165 40 34)" opacity="0.95"/>
  <ellipse cx="40" cy="34" rx="7" ry="18" fill="url(#petalA)" transform="rotate(220 40 34)" opacity="0.9"/>
  <ellipse cx="40" cy="34" rx="7" ry="18" fill="url(#petalB)" transform="rotate(275 40 34)" opacity="0.95"/>
  <ellipse cx="40" cy="34" rx="6" ry="14" fill="#FFC4D4" transform="rotate(30 40 34)" opacity="0.85"/>
  <ellipse cx="40" cy="34" rx="6" ry="14" fill="#FFB3C8" transform="rotate(90 40 34)" opacity="0.8"/>
  <circle cx="40" cy="34" r="4.5" fill="#F0D48A"/>
  <circle cx="40" cy="34" r="2.2" fill="#E8A050"/>
</svg>`;

const LAYOUTS = [
  { tx: '-140px', ty: '-150px', rot: '-28deg', scale: 1.15, size: '88px', delay: '0.05s', dur: '0.95s' },
  { tx: '130px', ty: '-145px', rot: '32deg', scale: 1.1, size: '82px', delay: '0.12s', dur: '0.9s' },
  { tx: '-160px', ty: '-40px', rot: '-48deg', scale: 0.95, size: '74px', delay: '0.18s', dur: '1s' },
  { tx: '155px', ty: '-35px', rot: '42deg', scale: 1, size: '78px', delay: '0.08s', dur: '0.92s' },
  { tx: '-90px', ty: '-195px', rot: '-12deg', scale: 0.85, size: '68px', delay: '0.22s', dur: '1.05s' },
  { tx: '85px', ty: '-200px', rot: '18deg', scale: 0.9, size: '70px', delay: '0.16s', dur: '1s' },
  { tx: '10px', ty: '-220px', rot: '6deg', scale: 1.2, size: '92px', delay: '0.02s', dur: '0.88s' },
  { tx: '-40px', ty: '-110px', rot: '-8deg', scale: 0.75, size: '60px', delay: '0.28s', dur: '0.85s' },
  { tx: '45px', ty: '-105px', rot: '14deg', scale: 0.78, size: '62px', delay: '0.3s', dur: '0.87s' },
];

function buildLilies(layer) {
  layer.innerHTML = '';
  LAYOUTS.forEach((cfg, i) => {
    const el = document.createElement('div');
    el.className = 'lily';
    el.style.setProperty('--tx', cfg.tx);
    el.style.setProperty('--ty', cfg.ty);
    el.style.setProperty('--rot', cfg.rot);
    el.style.setProperty('--scale', String(cfg.scale));
    el.style.setProperty('--size', cfg.size);
    el.style.setProperty('--delay', cfg.delay);
    el.style.setProperty('--dur', cfg.dur);
    el.innerHTML = LILY_SVG.replace(/id="(petal[AB])"/g, `id="$1-${i}"`)
      .replace(/url\(#(petal[AB])\)/g, `url(#$1-${i})`);
    layer.appendChild(el);
  });
}

export function initGift() {
  const giftBoard = document.getElementById('gift-board');
  const present = document.getElementById('present');
  const lilyBurst = document.getElementById('lily-burst');
  const rewrapBtn = document.getElementById('rewrap-btn');

  buildLilies(lilyBurst);

  function openPresent() {
    if (giftBoard.classList.contains('is-open')) return;
    giftBoard.classList.add('is-open');
    rewrapBtn.hidden = false;
    burst(present, 14);
    setTimeout(launchConfetti, 220);
  }

  function closePresent() {
    giftBoard.classList.remove('is-open');
    rewrapBtn.hidden = true;
    buildLilies(lilyBurst);
    burst(present, 6);
  }

  present.addEventListener('click', openPresent);
  rewrapBtn.addEventListener('click', closePresent);
}
