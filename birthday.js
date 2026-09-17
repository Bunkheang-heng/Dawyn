/* ═══════════════════════════════════════════
   birthday.js — Unc.nhii's 19th Birthday
   ═══════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────────
   SLIDE NAVIGATION
────────────────────────────────────────── */
const TOTAL_SLIDES = 5;
let currentSlide  = 0;
let letterRevealed = false;
let revealed      = false;

const wrapper    = document.getElementById('slides-wrapper');
const prevBtn    = document.getElementById('nav-prev');
const nextBtn    = document.getElementById('nav-next');
const dotNav     = document.getElementById('dot-nav');
const counter    = document.getElementById('slide-counter');
const progressBar = document.getElementById('progress-bar');
const centerNextBtn  = document.getElementById('center-next-btn');
const centerNextText = document.getElementById('center-next-text');
const heroNextBtn    = document.getElementById('hero-next-btn');

// Build dot indicators
const dots = [];
for (let i = 0; i < TOTAL_SLIDES; i++) {
  const btn = document.createElement('button');
  btn.classList.add('dot');
  btn.setAttribute('role', 'tab');
  btn.setAttribute('aria-label', `Go to slide ${i + 1}`);
  btn.addEventListener('click', () => goTo(i));
  dotNav.appendChild(btn);
  dots.push(btn);
}

function goTo(n) {
  n = Math.max(0, Math.min(n, TOTAL_SLIDES - 1));
  const prev = currentSlide;
  currentSlide = n;
  wrapper.style.transform = `translateX(${-n * 100}vw)`;
  updateNavUI();
  // Burst sparkles from active button
  if (centerNextBtn) burstFromBtn(centerNextBtn);
  if (n > prev) burstFromBtn(nextBtn);
  else if (n < prev) burstFromBtn(prevBtn);
  onSlideEnter(n);
}

function updateNavUI() {
  prevBtn.disabled = currentSlide === 0;
  nextBtn.disabled = currentSlide === TOTAL_SLIDES - 1;
  dots.forEach((d, i) => {
    d.classList.toggle('active', i === currentSlide);
    d.setAttribute('aria-selected', String(i === currentSlide));
  });
  counter.textContent = `${currentSlide + 1} / ${TOTAL_SLIDES}`;
  // Progress bar
  const pct = currentSlide === 0
    ? 0
    : (currentSlide / (TOTAL_SLIDES - 1)) * 100;
  progressBar.style.width = `${pct}%`;

  // Center Next button label
  if (centerNextText && centerNextBtn) {
    if (currentSlide === TOTAL_SLIDES - 1) {
      centerNextText.textContent = 'Back to Start ↺';
      centerNextBtn.setAttribute('aria-label', 'Return to first slide');
    } else {
      centerNextText.textContent = 'Next ✨';
      centerNextBtn.setAttribute('aria-label', `Go to slide ${currentSlide + 2}`);
    }
  }
}

let slideEnterRaf = 0;

function onSlideEnter(n) {
  document.querySelectorAll('.slide').forEach(s => s.classList.remove('is-active'));
  const activeSlide = document.getElementById(`slide-${n}`);
  if (activeSlide) {
    const content = activeSlide.querySelector('.slide-content');
    if (content) content.scrollTop = 0;
    if (slideEnterRaf) cancelAnimationFrame(slideEnterRaf);
    // Reflow, then activate so CSS entrance transitions still fire reliably
    void activeSlide.offsetWidth;
    slideEnterRaf = requestAnimationFrame(() => {
      slideEnterRaf = 0;
      activeSlide.classList.add('is-active');
    });
    // Fallback if rAF is delayed/skipped during rapid navigation
    setTimeout(() => {
      if (!activeSlide.classList.contains('is-active') && currentSlide === n) {
        activeSlide.classList.add('is-active');
      }
    }, 50);
  }

  if (n === 4 && !letterRevealed) {
    letterRevealed = true;
    setTimeout(() => {
      const seal = document.getElementById('wax-seal');
      if (seal && typeof burstFromBtn === 'function') burstFromBtn(seal);
    }, 450);
  }
}

prevBtn.addEventListener('click', () => goTo(currentSlide - 1));
nextBtn.addEventListener('click', () => goTo(currentSlide + 1));

if (centerNextBtn) {
  centerNextBtn.addEventListener('click', () => {
    if (currentSlide < TOTAL_SLIDES - 1) {
      goTo(currentSlide + 1);
    } else {
      goTo(0);
      if (typeof launchConfetti === 'function') launchConfetti();
    }
  });
}

if (heroNextBtn) {
  heroNextBtn.addEventListener('click', () => goTo(1));
}

// Keyboard navigation
document.addEventListener('keydown', e => {
  if (!revealed) return;
  if (document.getElementById('lightbox').classList.contains('open')) return;
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goTo(currentSlide + 1);
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goTo(currentSlide - 1);
});

// Touch / swipe
let touchStartX = 0;
document.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
document.addEventListener('touchend',   e => {
  if (!revealed) return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (dx >  50) goTo(currentSlide - 1);
  if (dx < -50) goTo(currentSlide + 1);
}, { passive: true });

// Init (activate slide 0)
updateNavUI();
onSlideEnter(0);


/* ──────────────────────────────────────────
   SURPRISE REVEAL
────────────────────────────────────────── */
const surpriseScreen = document.getElementById('surprise-screen');
const revealBtn      = document.getElementById('reveal-btn');

revealBtn.addEventListener('click', () => {
  revealed = true;
  document.body.classList.add('is-revealed');
  surpriseScreen.classList.add('hidden');
  userWantsMusic = true;
  playMusic();
  if (typeof launchConfetti === 'function') setTimeout(launchConfetti, 400);
});


/* ──────────────────────────────────────────
   CUSTOM CURSOR
────────────────────────────────────────── */
const cursorRing = document.getElementById('cursor');
const cursorDot  = document.getElementById('cursor-dot');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursorDot.style.left = `${mouseX}px`;
  cursorDot.style.top  = `${mouseY}px`;
  spawnSparkle(mouseX, mouseY);
});

(function animateCursor() {
  ringX += (mouseX - ringX) * 0.14;
  ringY += (mouseY - ringY) * 0.14;
  cursorRing.style.left = `${ringX}px`;
  cursorRing.style.top  = `${ringY}px`;
  requestAnimationFrame(animateCursor);
})();

// Hover effect on interactive elements
function bindCursorHover(root = document) {
  root.querySelectorAll(
    'button, a, .photo-card, .gift-present, .wax-seal, .interactive-flower, .destination-card, .cake-wrapper, .envelope-closed, .wish-chip'
  ).forEach(el => {
    if (el.dataset.cursorBound) return;
    el.dataset.cursorBound = '1';
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovered'));
  });
}
bindCursorHover();


/* ──────────────────────────────────────────
   SPARKLE TRAIL
────────────────────────────────────────── */
const sparkleContainer = document.getElementById('sparkle-container');
let lastSparkle = 0;

const sparkleColors = [
  'hsl(340,85%,65%)',
  'hsl(42,90%,55%)',
  'hsl(270,75%,65%)',
  'hsl(330,80%,72%)',
  'hsl(42,95%,70%)',
];

function spawnSparkle(x, y) {
  if (Date.now() - lastSparkle < 40) return;
  lastSparkle = Date.now();
  const el = document.createElement('div');
  el.classList.add('sparkle');
  const size  = 4 + Math.random() * 5;
  const angle = Math.random() * Math.PI * 2;
  const dist  = 18 + Math.random() * 32;
  el.style.cssText = `
    left:${x}px; top:${y}px;
    width:${size}px; height:${size}px;
    background:${sparkleColors[Math.floor(Math.random() * sparkleColors.length)]};
    --tx:${Math.cos(angle)*dist}px; --ty:${Math.sin(angle)*dist}px;
    opacity:0.8;
  `;
  sparkleContainer.appendChild(el);
  setTimeout(() => el.remove(), 700);
}

// Burst from a nav button
function burstFromBtn(btn) {
  const rect = btn.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top  + rect.height / 2;
  for (let i = 0; i < 8; i++) {
    setTimeout(() => spawnSparkle(cx + (Math.random()-0.5)*20, cy + (Math.random()-0.5)*20), i * 30);
  }
}


/* ──────────────────────────────────────────
   RIPPLE EFFECT on all buttons
────────────────────────────────────────── */
function addRipple(btn, e) {
  const r    = document.createElement('span');
  r.classList.add('ripple');
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  r.style.cssText = `
    width:${size}px; height:${size}px;
    left:${e.clientX - rect.left - size/2}px;
    top:${e.clientY  - rect.top  - size/2}px;
  `;
  btn.appendChild(r);
  setTimeout(() => r.remove(), 650);
}

document.querySelectorAll('button').forEach(btn => {
  btn.style.position = 'relative';
  btn.style.overflow = 'hidden';
  btn.addEventListener('click', e => addRipple(btn, e));
});


/* ──────────────────────────────────────────
   DECORATIVE ORBS (light mode background)
────────────────────────────────────────── */
const orbsLayer = document.getElementById('orbs-layer');

const ORB_DATA = [
  { color: 'hsl(340,80%,78%)', size: 420, x: 10,  y: 15,  dur: 14 },
  { color: 'hsl(270,70%,80%)', size: 360, x: 75,  y: 60,  dur: 18 },
  { color: 'hsl(42,90%,78%)',  size: 300, x: 45,  y: 80,  dur: 12 },
  { color: 'hsl(320,60%,82%)', size: 280, x: 85,  y: 10,  dur: 16 },
];
ORB_DATA.forEach(o => {
  const el = document.createElement('div');
  el.classList.add('orb');
  el.style.cssText = `
    width:${o.size}px; height:${o.size}px;
    left:${o.x}%; top:${o.y}%;
    background:${o.color};
    animation-duration:${o.dur}s;
    animation-delay:${-Math.random()*o.dur}s;
    opacity:0.22;
  `;
  orbsLayer.appendChild(el);
});


/* ──────────────────────────────────────────
   FLOATING EMOJIS (Hero slide)
────────────────────────────────────────── */
const floatContainer = document.getElementById('floating-emojis');
const EMOJIS = ['🎂','🎁','🎊','🌸','✨','🎀','💖','🌟','🥂','🎈','🦋','💫'];

(function buildEmojis() {
  for (let i = 0; i < 14; i++) {
    const el = document.createElement('div');
    el.classList.add('emoji-float');
    el.textContent = EMOJIS[i % EMOJIS.length];
    const size = 0.9 + Math.random() * 1.4;
    el.style.cssText = `
      left:${Math.random()*100}%;
      font-size:${size}rem;
      animation-duration:${10+Math.random()*14}s;
      animation-delay:${-Math.random()*14}s;
    `;
    floatContainer.appendChild(el);
  }
})();


/* ──────────────────────────────────────────
   CONFETTI
────────────────────────────────────────── */
const canvas = document.getElementById('canvas-confetti');
const ctx    = canvas.getContext('2d');
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener('resize', () => {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
});

let particles = [];
let animId    = null;
const COLORS  = ['#ff7eb3','#ffcf55','#a78bfa','#67e8f9','#fb923c','#f472b6','#818cf8','#34d399'];

function launchConfetti() {
  for (let i = 0; i < 160; i++) {
    particles.push({
      x: Math.random() * canvas.width, y: -10 - Math.random() * 200,
      r: 4 + Math.random() * 5,
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
      vx: (Math.random() - 0.5) * 4, vy: 2 + Math.random() * 4,
      rot: Math.random() * Math.PI * 2, spin: (Math.random() - 0.5) * 0.2,
      life: 1, decay: 0.007 + Math.random() * 0.006,
    });
  }
  if (!animId) animateConfetti();
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles = particles.filter(p => p.life > 0);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy; p.vy += 0.08; p.rot += p.spin; p.life -= p.decay;
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.translate(p.x, p.y); ctx.rotate(p.rot);
    ctx.fillStyle = p.c; ctx.fillRect(-p.r/2, -p.r/2, p.r, p.r * 0.55);
    ctx.restore();
  });
  if (particles.length > 0) { animId = requestAnimationFrame(animateConfetti); }
  else { animId = null; ctx.clearRect(0, 0, canvas.width, canvas.height); }
}

document.getElementById('confetti-btn').addEventListener('click', launchConfetti);


/* ──────────────────────────────────────────
   PHOTO CARD 3D TILT
────────────────────────────────────────── */
document.querySelectorAll('.photo-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const dx = (e.clientX - r.left  - r.width  / 2) / (r.width  / 2);
    const dy = (e.clientY - r.top   - r.height / 2) / (r.height / 2);
    card.style.transform = `
      perspective(800px)
      rotateY(${dx * 9}deg)
      rotateX(${-dy * 9}deg)
      scale(1.04)
      translateY(-6px)
    `;
    card.querySelector('img').style.transform = `scale(1.06) translate(${dx*3}px, ${dy*3}px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.querySelector('img').style.transform = '';
  });
});


/* ──────────────────────────────────────────
   FLOATING FLOWER PETALS BURST
────────────────────────────────────────── */
function spawnPetal(x, y) {
  const el = document.createElement('div');
  el.classList.add('floating-petal');
  const petals = ['🌸', '🌺', '🌷', '✨', '💐', '💖', '🌼'];
  el.textContent = petals[Math.floor(Math.random() * petals.length)];
  const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.6;
  const dist = 70 + Math.random() * 95;
  const tx = Math.cos(angle) * dist;
  const ty = Math.sin(angle) * dist;
  const rot = (Math.random() - 0.5) * 360;
  el.style.cssText = `
    left: ${x}px;
    top: ${y}px;
    font-size: ${16 + Math.random() * 12}px;
    --tx: ${tx}px;
    --ty: ${ty}px;
    --rot: ${rot}deg;
    animation: petal-burst 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  `;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1200);
}


/* ──────────────────────────────────────────
   A SPECIAL BIRTHDAY GIFT & POPPING FLOWER BOUQUET
────────────────────────────────────────── */
const giftShowcase       = document.getElementById('gift-showcase');
const giftPresent        = document.getElementById('gift-present');
const giftRepackBtn      = document.getElementById('gift-repack-btn');
const flowerSpeechBubble = document.getElementById('flower-speech-bubble');
const speechIcon         = document.getElementById('speech-icon');
const flowerSpeechText   = document.getElementById('flower-speech-text');
const btnShowerPetals    = document.getElementById('btn-shower-petals');
const btnSparkleMagic    = document.getElementById('btn-sparkle-magic');

const DEFAULT_FLOWER_HINT = 'Tap a flower — in the bouquet or below — for a secret wish ✦';
const bloomedFlowers = new Set();

function markWishChip(flowerId) {
  document.querySelectorAll('.wish-chip').forEach(chip => {
    chip.classList.toggle('is-picked', chip.dataset.flower === flowerId || bloomedFlowers.has(chip.dataset.flower));
  });
}

function openGift() {
  if (!giftShowcase || giftShowcase.classList.contains('is-opened')) return;
  giftShowcase.classList.add('is-opened');

  if (giftPresent) {
    const rect = giftPresent.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height * 0.45;

    for (let i = 0; i < 18; i++) {
      setTimeout(() => spawnPetal(cx + (Math.random() - 0.5) * 70, cy + (Math.random() - 0.5) * 50), i * 30);
    }
    for (let i = 0; i < 12; i++) {
      setTimeout(() => spawnSparkle(cx + (Math.random() - 0.5) * 90, cy + (Math.random() - 0.5) * 70), i * 25);
    }
  }

  // On stacked layouts, ease the wish panel into view
  setTimeout(() => {
    const panel = document.getElementById('gift-wish-panel');
    const content = document.querySelector('#slide-3 .slide-content');
    if (panel && content && window.innerWidth < 900) {
      const target = Math.max(0, panel.offsetTop - 24);
      content.scrollTo({ top: target, behavior: 'smooth' });
    }
  }, 450);

  if (typeof launchConfetti === 'function') {
    setTimeout(launchConfetti, 250);
  }
}

function closeGift(e) {
  if (e) e.stopPropagation();
  if (!giftShowcase) return;
  giftShowcase.classList.remove('is-opened');
  bloomedFlowers.clear();
  document.querySelectorAll('.wish-chip').forEach(chip => chip.classList.remove('is-picked'));

  if (flowerSpeechText) {
    setTimeout(() => {
      if (speechIcon) speechIcon.textContent = '🌸';
      flowerSpeechText.textContent = DEFAULT_FLOWER_HINT;
      if (flowerSpeechBubble) flowerSpeechBubble.classList.remove('has-bloomed');
    }, 400);
  }

  if (giftPresent) {
    const rect = giftPresent.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height * 0.5;
    for (let i = 0; i < 6; i++) {
      setTimeout(() => spawnSparkle(cx + (Math.random() - 0.5) * 40, cy + (Math.random() - 0.5) * 40), i * 25);
    }
  }
}

// Present click to open
if (giftPresent) {
  giftPresent.addEventListener('click', () => {
    if (!giftShowcase.classList.contains('is-opened')) {
      openGift();
    }
  });

  giftPresent.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (!giftShowcase.classList.contains('is-opened')) {
        e.preventDefault();
        openGift();
      }
    }
  });
}

// Interactive Flowers
function triggerFlowerBloom(flowerEl) {
  if (!flowerEl) return;
  const name = flowerEl.getAttribute('data-name') || 'Flower';
  const icon = flowerEl.getAttribute('data-icon') || '🌸';
  const msg  = flowerEl.getAttribute('data-msg') || 'Happy Birthday!';
  const id   = flowerEl.id || name;

  if (flowerSpeechBubble && flowerSpeechText) {
    if (speechIcon) speechIcon.textContent = icon;
    flowerSpeechText.textContent = `${name}: "${msg}"`;
    flowerSpeechBubble.classList.remove('has-bloomed');
    void flowerSpeechBubble.offsetWidth;
    flowerSpeechBubble.classList.add('has-bloomed');
  }

  flowerEl.classList.remove('is-bloomed');
  void flowerEl.offsetWidth;
  flowerEl.classList.add('is-bloomed');
  setTimeout(() => flowerEl.classList.remove('is-bloomed'), 700);

  const rect = flowerEl.getBoundingClientRect();
  const fx = rect.left + rect.width / 2;
  const fy = rect.top + rect.height / 2;

  for (let i = 0; i < 7; i++) {
    setTimeout(() => spawnPetal(fx + (Math.random() - 0.5) * 25, fy + (Math.random() - 0.5) * 25), i * 35);
  }
  for (let i = 0; i < 6; i++) {
    setTimeout(() => spawnSparkle(fx + (Math.random() - 0.5) * 35, fy + (Math.random() - 0.5) * 35), i * 30);
  }

  bloomedFlowers.add(id);
  markWishChip(id);

  const totalFlowers = document.querySelectorAll('.interactive-flower').length;
  if (bloomedFlowers.size === totalFlowers && flowerSpeechText) {
    setTimeout(() => {
      if (speechIcon) speechIcon.textContent = '💖';
      flowerSpeechText.textContent = 'Every flower bloomed — a full garden of wishes just for you! ✦';
      if (typeof launchConfetti === 'function') launchConfetti();
    }, 400);
  }
}

document.querySelectorAll('.interactive-flower').forEach(flower => {
  flower.addEventListener('click', (e) => {
    e.stopPropagation();
    triggerFlowerBloom(flower);
  });

  flower.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      triggerFlowerBloom(flower);
    }
  });
});

document.querySelectorAll('.wish-chip').forEach(chip => {
  chip.addEventListener('click', e => {
    e.stopPropagation();
    const flower = document.getElementById(chip.dataset.flower);
    if (flower) triggerFlowerBloom(flower);
  });
});

// Shower petals button
if (btnShowerPetals) {
  btnShowerPetals.addEventListener('click', (e) => {
    e.stopPropagation();
    if (flowerSpeechBubble && flowerSpeechText) {
      if (speechIcon) speechIcon.textContent = '🌸';
      flowerSpeechText.textContent = 'A shower of fragrant petals for a wonderful 19th birthday! ✦';
      flowerSpeechBubble.classList.add('has-bloomed');
    }
    const width = window.innerWidth;
    for (let i = 0; i < 26; i++) {
      setTimeout(() => {
        const x = Math.random() * width;
        const y = 50 + Math.random() * (window.innerHeight * 0.5);
        spawnPetal(x, y);
      }, i * 45);
    }
  });
}

// Magic sparkles button
if (btnSparkleMagic) {
  btnSparkleMagic.addEventListener('click', (e) => {
    e.stopPropagation();
    if (flowerSpeechBubble && flowerSpeechText) {
      if (speechIcon) speechIcon.textContent = '✨';
      flowerSpeechText.textContent = 'May all your brightest dreams and wishes come true! ✦';
      flowerSpeechBubble.classList.add('has-bloomed');
    }
    if (typeof launchConfetti === 'function') {
      launchConfetti();
    }
    const width = window.innerWidth;
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const x = Math.random() * width;
        const y = 80 + Math.random() * (window.innerHeight * 0.6);
        spawnSparkle(x, y);
      }, i * 40);
    }
  });
}

if (giftRepackBtn) {
  giftRepackBtn.addEventListener('click', closeGift);
}


/* ──────────────────────────────────────────
   MAGNETIC NAV ARROWS
────────────────────────────────────────── */
document.querySelectorAll('.nav-arrow').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    if (btn.disabled) return;
    const r  = btn.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width  / 2) * 0.3;
    const dy = (e.clientY - r.top  - r.height / 2) * 0.3;
    btn.style.transform = `translateY(-50%) translate(${dx}px, ${dy}px) scale(1.12)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translateY(-50%)';
  });
});


/* ──────────────────────────────────────────
   MUSIC ENGINE (YouTube Player: 1mVogXexCZg)
────────────────────────────────────────── */
const YT_VIDEO_ID  = '1mVogXexCZg';
let ytPlayer       = null;
let ytReady        = false;
let musicPlaying   = false;
let userWantsMusic = true; // Attempt playback upon access and user interaction

window.onYouTubeIframeAPIReady = function() {
  ytPlayer = new YT.Player('yt-player', {
    videoId: YT_VIDEO_ID,
    playerVars: {
      autoplay: 1,
      controls: 0,
      disablekb: 1,
      fs: 0,
      loop: 1,
      playlist: YT_VIDEO_ID,
      playsinline: 1,
      modestbranding: 1
    },
    events: {
      onReady: (event) => {
        ytReady = true;
        // Attempt autoplay as soon as accessed
        event.target.playVideo();
        if (userWantsMusic) {
          event.target.playVideo();
        }
      },
      onStateChange: (event) => {
        // YT.PlayerState: PLAYING = 1, PAUSED = 2, ENDED = 0
        if (event.data === 1) {
          musicPlaying = true;
          document.getElementById('music-icon').textContent = '⏸';
          document.getElementById('equalizer').classList.remove('paused');
        } else if (event.data === 2 || event.data === 0) {
          musicPlaying = false;
          document.getElementById('music-icon').textContent = '▶';
          document.getElementById('equalizer').classList.add('paused');
          if (event.data === 0 && userWantsMusic && ytPlayer) {
            ytPlayer.playVideo();
          }
        }
      },
      onError: (err) => {
        console.warn('YouTube Player note:', err);
      }
    }
  });
};

function playMusic() {
  userWantsMusic = true;
  if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
    ytPlayer.playVideo();
  }
}

function pauseMusic() {
  userWantsMusic = false;
  if (ytPlayer && typeof ytPlayer.pauseVideo === 'function') {
    ytPlayer.pauseVideo();
  }
}

function toggleMusic() {
  if (musicPlaying) pauseMusic();
  else              playMusic();
}

document.getElementById('music-btn').addEventListener('click', toggleMusic);

// Unlock autoplay on first touch / click gesture if restricted by browser policy
function attemptAutoplayUnlock() {
  if (!musicPlaying && userWantsMusic && ytPlayer && typeof ytPlayer.playVideo === 'function') {
    ytPlayer.playVideo();
  }
}
document.addEventListener('click', attemptAutoplayUnlock, { once: true });
document.addEventListener('touchstart', attemptAutoplayUnlock, { once: true });


/* ──────────────────────────────────────────
   CAKE INTERACTION + PARTICLE BURST
────────────────────────────────────────── */
const cakeWrapper   = document.getElementById('cake-wrapper');
const cakeHint      = document.getElementById('cake-hint');
const cakeRelightBtn = document.getElementById('cake-relight-btn');
let   cakeBlown     = false;
const flameEls      = ['flame1','flame2','flame3','flame4','flame5'].map(id => document.getElementById(id));
const CAKE_HINT_IDLE = '<span aria-hidden="true">✦</span> Tap the cake to blow out the candles <span aria-hidden="true">✦</span>';
const CAKE_HINT_DONE = '🎉 Happy Birthday, Unc.nhii! Wish granted!';

function blowOutCake() {
  if (cakeBlown || !cakeWrapper) return;
  cakeBlown = true;
  cakeWrapper.classList.add('is-blown');
  cakeWrapper.setAttribute('aria-label', 'Birthday cake — candles blown out');

  flameEls.forEach((f, i) => {
    if (!f) return;
    setTimeout(() => {
      f.style.opacity = '0';
      f.style.transform = 'scaleY(0)';
      f.style.transition = 'opacity 0.3s, transform 0.3s';
    }, i * 90);
  });

  setTimeout(() => {
    spawnCakeParticles();
    if (cakeHint) {
      cakeHint.textContent = CAKE_HINT_DONE;
      cakeHint.style.opacity = '1';
    }
    if (cakeRelightBtn) cakeRelightBtn.hidden = false;
    launchConfetti();
  }, flameEls.length * 90 + 150);
}

function relightCake(e) {
  if (e) e.stopPropagation();
  cakeBlown = false;
  if (cakeWrapper) {
    cakeWrapper.classList.remove('is-blown');
    cakeWrapper.setAttribute('aria-label', 'Birthday cake — tap to blow out the candles');
  }
  flameEls.forEach((f, i) => {
    if (!f) return;
    setTimeout(() => {
      f.style.opacity = '1';
      f.style.transform = '';
      f.style.transition = 'opacity 0.35s, transform 0.35s';
    }, i * 70);
  });
  if (cakeHint) cakeHint.innerHTML = CAKE_HINT_IDLE;
  if (cakeRelightBtn) cakeRelightBtn.hidden = true;
  if (cakeWrapper) {
    const rect = cakeWrapper.getBoundingClientRect();
    for (let i = 0; i < 8; i++) {
      setTimeout(() => spawnSparkle(
        rect.left + rect.width / 2 + (Math.random() - 0.5) * 40,
        rect.top + rect.height * 0.25 + (Math.random() - 0.5) * 20
      ), i * 30);
    }
  }
}

if (cakeWrapper) {
  cakeWrapper.addEventListener('click', e => {
    if (e.target.closest('#cake-relight-btn')) return;
    blowOutCake();
  });
  cakeWrapper.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      blowOutCake();
    }
  });
}
if (cakeRelightBtn) cakeRelightBtn.addEventListener('click', relightCake);

function spawnCakeParticles() {
  const cake = document.getElementById('birthday-cake');
  if (!cake) return;
  const rect = cake.getBoundingClientRect();
  const cx   = rect.left + rect.width  / 2;
  const cy   = rect.top  + rect.height / 3;
  const BITS = ['💖','✨','🌸','⭐','💫','🎊','🌟','💕'];

  for (let i = 0; i < 22; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.textContent = BITS[Math.floor(Math.random() * BITS.length)];
      const angle = Math.random() * Math.PI * 2;
      const dist  = 80 + Math.random() * 130;
      el.style.cssText = `
        position:fixed;
        left:${cx}px; top:${cy}px;
        font-size:${0.9 + Math.random() * 0.9}rem;
        pointer-events:none; z-index:200;
        animation: cake-particle-fly 1.1s ease forwards;
        --px:${Math.cos(angle)*dist}px;
        --py:${Math.sin(angle)*dist - 60}px;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1100);
    }, i * 55);
  }
}


/* ──────────────────────────────────────────
   LIGHTBOX
────────────────────────────────────────── */
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightbox-img');
const lightboxCap   = document.getElementById('lightbox-caption');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev  = document.getElementById('lightbox-prev');
const lightboxNext  = document.getElementById('lightbox-next');
const lightboxCount = document.getElementById('lightbox-counter');
let lightboxIndex = 0;

const photoData = [
  { src: 'asset/singapore/image.png',  caption: 'Singapore 🇸🇬 — First time we met! A moment to remember forever ✨' },
  { src: 'asset/singapore/image2.png', caption: 'Singapore 🇸🇬 — Snacks, souvenirs & little treasures from our trip 🎁' },
  { src: 'asset/singapore/image3.png', caption: 'Singapore 🇸🇬 — Dancing, laughing, and celebrating together 🎉' },
  { src: 'asset/vietname/IMG_0236.jpg', caption: 'Vietnam 🇻🇳 — Romantic dinner overlooking the sparkling city lights 🌃' },
  { src: 'asset/vietname/IMG_0180.jpg', caption: 'Vietnam 🇻🇳 — Brunch & coffee date together at Soko ☕' },
  { src: 'asset/vietname/IMG_0225.jpg', caption: 'Vietnam 🇻🇳 — Joyrides and endless laughter on the road 🚗' },
];

function showLightboxPhoto(i) {
  lightboxIndex = (i + photoData.length) % photoData.length;
  const shot = photoData[lightboxIndex];
  lightboxImg.src = shot.src;
  lightboxImg.alt = shot.caption;
  lightboxCap.textContent = shot.caption;
  if (lightboxCount) lightboxCount.textContent = `${lightboxIndex + 1} / ${photoData.length}`;
}

function openLightbox(i) {
  showLightboxPhoto(i);
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { lightboxImg.src = ''; }, 350);
}

document.querySelectorAll('.photo-card').forEach((card, i) => {
  card.addEventListener('click', e => {
    e.stopPropagation();
    openLightbox(i);
  });
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      openLightbox(i);
    }
  });
});
lightboxClose.addEventListener('click', closeLightbox);
if (lightboxPrev) lightboxPrev.addEventListener('click', e => { e.stopPropagation(); showLightboxPhoto(lightboxIndex - 1); });
if (lightboxNext) lightboxNext.addEventListener('click', e => { e.stopPropagation(); showLightboxPhoto(lightboxIndex + 1); });
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft')  showLightboxPhoto(lightboxIndex - 1);
  if (e.key === 'ArrowRight') showLightboxPhoto(lightboxIndex + 1);
});


/* ──────────────────────────────────────────
   DESTINATION CARDS — SPOTLIGHT MEMORIES
────────────────────────────────────────── */
const destHint = document.getElementById('dest-hint');

function spotlightDestination(card) {
  document.querySelectorAll('.destination-card').forEach(c => {
    const on = c === card && !c.classList.contains('is-spotlight');
    c.classList.toggle('is-spotlight', on);
    c.setAttribute('aria-pressed', String(on));
    const secret = c.querySelector('.dest-secret');
    if (secret) secret.textContent = on ? (c.dataset.memory || '') : '';
  });

  const active = card.classList.contains('is-spotlight');
  if (destHint) {
    destHint.innerHTML = active
      ? '<span aria-hidden="true">✦</span> Memory unlocked — tap again to dim, or open a photo <span aria-hidden="true">✦</span>'
      : '<span aria-hidden="true">✦</span> Tap a city card to spotlight the memory · tap any photo to zoom <span aria-hidden="true">✦</span>';
  }

  if (active) {
    const rect = card.getBoundingClientRect();
    for (let i = 0; i < 10; i++) {
      setTimeout(() => spawnSparkle(
        rect.left + rect.width * Math.random(),
        rect.top + 40 + Math.random() * 60
      ), i * 28);
    }
  }
}

document.querySelectorAll('.destination-card.interactive-card').forEach(card => {
  card.addEventListener('click', e => {
    if (e.target.closest('.photo-card, .meta-pill')) return;
    spotlightDestination(card);
  });
  card.addEventListener('keydown', e => {
    if (e.target !== card) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      spotlightDestination(card);
    }
  });
});

document.querySelectorAll('.meta-pill.is-interactive').forEach(pill => {
  pill.addEventListener('click', e => {
    e.stopPropagation();
    pill.classList.add('is-popped');
    setTimeout(() => pill.classList.remove('is-popped'), 450);
    const rect = pill.getBoundingClientRect();
    const emoji = document.createElement('div');
    emoji.className = 'pill-pop';
    emoji.textContent = pill.dataset.spark || '✨';
    emoji.style.cssText = `left:${rect.left + rect.width / 2}px;top:${rect.top}px;`;
    document.body.appendChild(emoji);
    setTimeout(() => emoji.remove(), 700);
    for (let i = 0; i < 5; i++) {
      setTimeout(() => spawnSparkle(rect.left + rect.width / 2, rect.top + rect.height / 2), i * 40);
    }
  });
});





/* ──────────────────────────────────────────
   SEALED ENVELOPE / MAIL SHIELD INTERACTION
────────────────────────────────────────── */
const envelopeWrapper  = document.getElementById('envelope-wrapper');
const envelopeClosed   = document.getElementById('envelope-closed');
const letterRecloseBtn = document.getElementById('letter-reclose-btn');
const waxSeal          = document.getElementById('wax-seal');
const letterTextEl     = document.getElementById('letter-text');
const letterSigEl      = document.getElementById('letter-sig');

const LETTER_FULL = `Dear Unc.nhii 🌸

Today you step into 19 — and honestly? The world is not ready for you yet.

You carry warmth, laughter, and a kind of magic that is entirely, beautifully yours. Never let anyone dim that spark.

May every candle you blow out be replaced by a dream that comes true. May every wish you whisper find its way back to you.

Here's to 19 years of being absolutely wonderful — and to every beautiful moment still to come. 🥂`;

let letterTypeTimer = null;
let letterTyping = false;

function typeLetter() {
  if (!letterTextEl) return;
  if (letterTypeTimer) clearInterval(letterTypeTimer);
  letterTyping = true;
  letterTextEl.textContent = '';
  letterTextEl.classList.add('is-typing');
  if (letterSigEl) letterSigEl.hidden = true;

  let i = 0;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    letterTextEl.textContent = LETTER_FULL;
    letterTextEl.classList.remove('is-typing');
    if (letterSigEl) letterSigEl.hidden = false;
    letterTyping = false;
    return;
  }

  letterTypeTimer = setInterval(() => {
    i += 1;
    letterTextEl.textContent = LETTER_FULL.slice(0, i);
    if (i >= LETTER_FULL.length) {
      clearInterval(letterTypeTimer);
      letterTypeTimer = null;
      letterTyping = false;
      letterTextEl.classList.remove('is-typing');
      if (letterSigEl) letterSigEl.hidden = false;
    }
  }, 16);
}

function openEnvelope() {
  if (!envelopeWrapper || envelopeWrapper.classList.contains('is-open')) return;

  if (waxSeal && typeof burstFromBtn === 'function') {
    burstFromBtn(waxSeal);
  }

  envelopeWrapper.classList.add('is-open');
  typeLetter();

  if (typeof launchConfetti === 'function') {
    setTimeout(launchConfetti, 250);
  }
}

function closeEnvelope(e) {
  if (e) e.stopPropagation();
  if (!envelopeWrapper) return;
  if (letterTypeTimer) {
    clearInterval(letterTypeTimer);
    letterTypeTimer = null;
  }
  letterTyping = false;
  if (letterTextEl) {
    letterTextEl.textContent = '';
    letterTextEl.classList.remove('is-typing');
  }
  if (letterSigEl) letterSigEl.hidden = true;
  envelopeWrapper.classList.remove('is-open');
}

if (envelopeClosed) {
  envelopeClosed.addEventListener('click', openEnvelope);
  envelopeClosed.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openEnvelope();
    }
  });
}

if (letterRecloseBtn) {
  letterRecloseBtn.addEventListener('click', closeEnvelope);
}
