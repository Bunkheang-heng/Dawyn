import { TOTAL, LABELS, state } from './state.js';
import { launchConfetti } from './effects.js';

const track = document.getElementById('deck-track');
const prevBtn = document.getElementById('nav-prev');
const nextBtn = document.getElementById('nav-next');
const continueBtn = document.getElementById('continue-btn');
const continueText = document.getElementById('continue-text');
const dotsNav = document.getElementById('chapter-dots');
const chapterLabel = document.getElementById('chapter-label');
const progress = document.getElementById('progress-fuse');

const dots = [];

function updateChrome() {
  prevBtn.disabled = state.chapter === 0;
  nextBtn.disabled = state.chapter === TOTAL - 1;
  dots.forEach((d, i) => {
    d.classList.toggle('active', i === state.chapter);
    d.setAttribute('aria-selected', String(i === state.chapter));
  });
  chapterLabel.textContent = LABELS[state.chapter];
  progress.style.width =
    state.chapter === 0 ? '4%' : `${(state.chapter / (TOTAL - 1)) * 100}%`;
  if (continueText) {
    continueText.textContent =
      state.chapter === TOTAL - 1 ? 'Back to start' : 'Continue';
  }
  continueBtn.classList.toggle('is-hidden', state.chapter === 0);
}

function activateChapter(n) {
  document.querySelectorAll('.chapter').forEach(c => c.classList.remove('is-active'));
  const el = document.getElementById(`ch-${n}`);
  if (!el) return;
  const scroller = el.querySelector('.chapter-inner');
  if (scroller) scroller.scrollTop = 0;
  void el.offsetWidth;
  requestAnimationFrame(() => el.classList.add('is-active'));
  setTimeout(() => {
    if (state.chapter === n) el.classList.add('is-active');
  }, 60);
}

export function goTo(n) {
  if (!state.opened && n > 0) return;
  n = Math.max(0, Math.min(n, TOTAL - 1));
  state.chapter = n;
  track.style.transform = `translateX(${-n * 100}vw)`;
  updateChrome();
  activateChapter(n);
}

export function initNav() {
  for (let i = 0; i < TOTAL; i++) {
    const d = document.createElement('button');
    d.className = 'dot';
    d.type = 'button';
    d.setAttribute('role', 'tab');
    d.setAttribute('aria-label', `Go to ${LABELS[i]}`);
    d.addEventListener('click', () => goTo(i));
    dotsNav.appendChild(d);
    dots.push(d);
  }

  prevBtn.addEventListener('click', () => goTo(state.chapter - 1));
  nextBtn.addEventListener('click', () => goTo(state.chapter + 1));
  continueBtn.addEventListener('click', () => {
    if (state.chapter < TOTAL - 1) goTo(state.chapter + 1);
    else {
      goTo(0);
      launchConfetti();
    }
  });

  document.getElementById('begin-btn')?.addEventListener('click', () => goTo(1));

  document.addEventListener('keydown', e => {
    if (!state.opened) return;
    if (!document.getElementById('lightbox').hidden) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goTo(state.chapter + 1);
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goTo(state.chapter - 1);
  });

  let touchX = 0;
  document.addEventListener('touchstart', e => {
    touchX = e.touches[0].clientX;
  }, { passive: true });
  document.addEventListener('touchend', e => {
    if (!state.opened) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (dx > 55) goTo(state.chapter - 1);
    if (dx < -55) goTo(state.chapter + 1);
  }, { passive: true });

  updateChrome();
  activateChapter(0);
}
