'use strict';

/* ═══════════════════════════════════════════
   Unc.nhii · 19 — Midnight Scrapbook
   ═══════════════════════════════════════════ */

const TOTAL = 5;
const LABELS = ['Welcome', 'Memories', 'Wish', 'Gift', 'Letter'];
let chapter = 0;
let opened = false;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const track = document.getElementById('deck-track');
const prevBtn = document.getElementById('nav-prev');
const nextBtn = document.getElementById('nav-next');
const continueBtn = document.getElementById('continue-btn');
const continueText = document.getElementById('continue-text');
const dotsNav = document.getElementById('chapter-dots');
const chapterLabel = document.getElementById('chapter-label');
const progress = document.getElementById('progress-fuse');
const sparkLayer = document.getElementById('sparkle-layer');

/* ── Dots ── */
const dots = [];
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

function goTo(n) {
  if (!opened && n > 0) return;
  n = Math.max(0, Math.min(n, TOTAL - 1));
  chapter = n;
  track.style.transform = `translateX(${-n * 100}vw)`;
  updateChrome();
  activateChapter(n);
}

function updateChrome() {
  prevBtn.disabled = chapter === 0;
  nextBtn.disabled = chapter === TOTAL - 1;
  dots.forEach((d, i) => {
    d.classList.toggle('active', i === chapter);
    d.setAttribute('aria-selected', String(i === chapter));
  });
  chapterLabel.textContent = LABELS[chapter];
  progress.style.width = chapter === 0 ? '4%' : `${(chapter / (TOTAL - 1)) * 100}%`;
  if (continueText) {
    continueText.textContent = chapter === TOTAL - 1 ? 'Back to start' : 'Continue';
  }
  continueBtn.classList.toggle('is-hidden', chapter === 0);
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
    if (chapter === n) el.classList.add('is-active');
  }, 60);
}

prevBtn.addEventListener('click', () => goTo(chapter - 1));
nextBtn.addEventListener('click', () => goTo(chapter + 1));
continueBtn.addEventListener('click', () => {
  if (chapter < TOTAL - 1) goTo(chapter + 1);
  else {
    goTo(0);
    launchConfetti();
  }
});

document.getElementById('begin-btn')?.addEventListener('click', () => goTo(1));

document.addEventListener('keydown', e => {
  if (!opened) return;
  if (!document.getElementById('lightbox').hidden) return;
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goTo(chapter + 1);
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goTo(chapter - 1);
});

let touchX = 0;
document.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
document.addEventListener('touchend', e => {
  if (!opened) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (dx > 55) goTo(chapter - 1);
  if (dx < -55) goTo(chapter + 1);
}, { passive: true });

updateChrome();
activateChapter(0);

/* ── Gate ── */
const gate = document.getElementById('gate');
document.getElementById('gate-open').addEventListener('click', () => {
  opened = true;
  gate.classList.add('is-open');
  document.body.classList.add('is-open');
  userWantsMusic = true;
  playMusic();
  setTimeout(launchConfetti, 500);
  setTimeout(() => { gate.style.display = 'none'; }, 1300);
});

/* ── Sparks ── */
function spawnSpark(x, y) {
  if (!sparkLayer) return;
  const el = document.createElement('div');
  el.className = 'spark';
  const angle = Math.random() * Math.PI * 2;
  const dist = 20 + Math.random() * 40;
  el.style.cssText = `
    left:${x}px; top:${y}px;
    background:${['#F0D48A', '#E8A0A8', '#5E9A9E', '#FFF8F0'][Math.floor(Math.random() * 4)]};
    --sx:${Math.cos(angle) * dist}px;
    --sy:${Math.sin(angle) * dist}px;
  `;
  sparkLayer.appendChild(el);
  setTimeout(() => el.remove(), 700);
}

function burst(el, count = 10) {
  if (!el) return;
  const r = el.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  for (let i = 0; i < count; i++) {
    setTimeout(() => spawnSpark(cx + (Math.random() - 0.5) * 30, cy + (Math.random() - 0.5) * 30), i * 28);
  }
}

/* ── Confetti ── */
const canvas = document.getElementById('canvas-confetti');
const ctx = canvas.getContext('2d');
function sizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
sizeCanvas();
window.addEventListener('resize', sizeCanvas);

let particles = [];
let confettiId = null;
const COLORS = ['#E8A0A8', '#D4B068', '#5E9A9E', '#F0D48A', '#F3EEE6', '#C56B76'];

function launchConfetti() {
  for (let i = 0; i < 140; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 180,
      r: 3 + Math.random() * 5,
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
      vx: (Math.random() - 0.5) * 3.5,
      vy: 2 + Math.random() * 3.5,
      rot: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.2,
      life: 1,
      decay: 0.007 + Math.random() * 0.006,
    });
  }
  if (!confettiId) tickConfetti();
}

function tickConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles = particles.filter(p => p.life > 0);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy; p.vy += 0.07; p.rot += p.spin; p.life -= p.decay;
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.c;
    ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.55);
    ctx.restore();
  });
  if (particles.length) confettiId = requestAnimationFrame(tickConfetti);
  else { confettiId = null; ctx.clearRect(0, 0, canvas.width, canvas.height); }
}

document.getElementById('celebrate-btn')?.addEventListener('click', () => {
  launchConfetti();
  burst(document.getElementById('celebrate-btn'), 14);
});

/* ── Music (YouTube) ── */
const YT_VIDEO_ID = '1mVogXexCZg';
let ytPlayer = null;
let musicPlaying = false;
let userWantsMusic = true;

window.onYouTubeIframeAPIReady = function () {
  ytPlayer = new YT.Player('yt-player', {
    videoId: YT_VIDEO_ID,
    playerVars: {
      autoplay: 0, controls: 0, disablekb: 1, fs: 0,
      loop: 1, playlist: YT_VIDEO_ID, playsinline: 1, modestbranding: 1,
    },
    events: {
      onStateChange: (event) => {
        if (event.data === 1) {
          musicPlaying = true;
          document.getElementById('music-icon').textContent = '❚❚';
        } else if (event.data === 2 || event.data === 0) {
          musicPlaying = false;
          document.getElementById('music-icon').textContent = '▶';
          if (event.data === 0 && userWantsMusic) ytPlayer.playVideo();
        }
      },
    },
  });
};

function playMusic() {
  userWantsMusic = true;
  if (ytPlayer?.playVideo) ytPlayer.playVideo();
}
function pauseMusic() {
  userWantsMusic = false;
  if (ytPlayer?.pauseVideo) ytPlayer.pauseVideo();
}
document.getElementById('music-btn').addEventListener('click', () => {
  if (musicPlaying) pauseMusic(); else playMusic();
});

/* ── Lightbox ── */
const photoData = [
  { src: 'asset/singapore/image.png', caption: 'Singapore — the first hello' },
  { src: 'asset/singapore/image2.png', caption: 'Singapore — snacks & little treasures' },
  { src: 'asset/singapore/image3.png', caption: 'Singapore — dancing through the night' },
  { src: 'asset/vietname/IMG_0236.jpg', caption: 'Vietnam — city lights & dinner dreams' },
  { src: 'asset/vietname/IMG_0180.jpg', caption: 'Vietnam — brunch & coffee' },
  { src: 'asset/vietname/IMG_0225.jpg', caption: 'Vietnam — road laughs' },
];

const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
const lbCap = document.getElementById('lb-cap');
const lbCount = document.getElementById('lb-count');
let lbIndex = 0;

function showPhoto(i) {
  lbIndex = (i + photoData.length) % photoData.length;
  const p = photoData[lbIndex];
  lbImg.src = p.src;
  lbImg.alt = p.caption;
  lbCap.textContent = p.caption;
  lbCount.textContent = `${lbIndex + 1} / ${photoData.length}`;
}
function openLightbox(i) {
  showPhoto(i);
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
  setTimeout(() => { lbImg.src = ''; }, 200);
}

document.querySelectorAll('.shot').forEach(btn => {
  btn.addEventListener('click', () => openLightbox(Number(btn.dataset.photo)));
});
document.getElementById('lb-close').addEventListener('click', closeLightbox);
document.getElementById('lb-prev').addEventListener('click', () => showPhoto(lbIndex - 1));
document.getElementById('lb-next').addEventListener('click', () => showPhoto(lbIndex + 1));
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => {
  if (lightbox.hidden) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showPhoto(lbIndex - 1);
  if (e.key === 'ArrowRight') showPhoto(lbIndex + 1);
});

/* ── Cake ── */
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

/* ── Gift ── */
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
      if (panel && scroller) scroller.scrollTo({ top: panel.offsetTop - 20, behavior: 'smooth' });
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

/* ── Letter ── */
const mail = document.getElementById('mail');
const envelope = document.getElementById('envelope');
const letter = document.getElementById('letter');
const letterBody = document.getElementById('letter-body');
const letterSign = document.getElementById('letter-sign');
const resealBtn = document.getElementById('reseal-btn');

const LETTER = `Dear Unc.nhii,

Today you step into 19 — and honestly? The world is not ready for you yet.

You carry warmth, laughter, and a kind of magic that is entirely, beautifully yours. Never let anyone dim that spark.

May every candle you blow out be replaced by a dream that comes true. May every wish you whisper find its way back to you.

Here's to 19 years of being absolutely wonderful — and to every beautiful moment still to come.`;

let typeTimer = null;

function typeLetter() {
  letterBody.textContent = '';
  letterBody.classList.add('is-typing');
  letterSign.hidden = true;
  if (typeTimer) clearInterval(typeTimer);
  if (reduceMotion) {
    letterBody.textContent = LETTER;
    letterBody.classList.remove('is-typing');
    letterSign.hidden = false;
    return;
  }
  let i = 0;
  typeTimer = setInterval(() => {
    i += 1;
    letterBody.textContent = LETTER.slice(0, i);
    if (i >= LETTER.length) {
      clearInterval(typeTimer);
      typeTimer = null;
      letterBody.classList.remove('is-typing');
      letterSign.hidden = false;
    }
  }, 14);
}

function openMail() {
  if (mail.classList.contains('is-open')) return;
  mail.classList.add('is-open');
  letter.hidden = false;
  document.getElementById('letter-lede').textContent = 'Read it slowly.';
  burst(envelope, 12);
  typeLetter();
  setTimeout(launchConfetti, 280);
}

function closeMail() {
  mail.classList.remove('is-open');
  letter.hidden = true;
  if (typeTimer) { clearInterval(typeTimer); typeTimer = null; }
  letterBody.textContent = '';
  letterBody.classList.remove('is-typing');
  letterSign.hidden = true;
  document.getElementById('letter-lede').textContent = 'Tap the seal when you’re ready.';
}

envelope.addEventListener('click', openMail);
resealBtn.addEventListener('click', closeMail);
