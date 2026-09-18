const sparkLayer = document.getElementById('sparkle-layer');
const canvas = document.getElementById('canvas-confetti');
const ctx = canvas.getContext('2d');

const COLORS = ['#E8A0A8', '#D4B068', '#5E9A9E', '#F0D48A', '#F3EEE6', '#C56B76'];
const SPARK_COLORS = ['#F0D48A', '#E8A0A8', '#5E9A9E', '#FFF8F0'];

let particles = [];
let confettiId = null;

function sizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

export function spawnSpark(x, y) {
  if (!sparkLayer) return;
  const el = document.createElement('div');
  el.className = 'spark';
  const angle = Math.random() * Math.PI * 2;
  const dist = 20 + Math.random() * 40;
  el.style.cssText = `
    left:${x}px; top:${y}px;
    background:${SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)]};
    --sx:${Math.cos(angle) * dist}px;
    --sy:${Math.sin(angle) * dist}px;
  `;
  sparkLayer.appendChild(el);
  setTimeout(() => el.remove(), 700);
}

export function burst(el, count = 10) {
  if (!el) return;
  const r = el.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  for (let i = 0; i < count; i++) {
    setTimeout(
      () => spawnSpark(cx + (Math.random() - 0.5) * 30, cy + (Math.random() - 0.5) * 30),
      i * 28
    );
  }
}

function tickConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles = particles.filter(p => p.life > 0);
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.07;
    p.rot += p.spin;
    p.life -= p.decay;
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.c;
    ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.55);
    ctx.restore();
  });
  if (particles.length) confettiId = requestAnimationFrame(tickConfetti);
  else {
    confettiId = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

export function launchConfetti() {
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

export function initEffects() {
  sizeCanvas();
  window.addEventListener('resize', sizeCanvas);
  document.getElementById('celebrate-btn')?.addEventListener('click', () => {
    launchConfetti();
    burst(document.getElementById('celebrate-btn'), 14);
  });
}
