import { state } from './state.js';
import { burst, launchConfetti } from './effects.js';

const LETTER = `Dear Unc.nhii,

Today you step into 19 — and honestly? The world is not ready for you yet.

You carry warmth, laughter, and a kind of magic that is entirely, beautifully yours. Never let anyone dim that spark.

May every candle you blow out be replaced by a dream that comes true. May every wish you whisper find its way back to you.

Here's to 19 years of being absolutely wonderful — and to every beautiful moment still to come.`;

export function initLetter() {
  const mail = document.getElementById('mail');
  const envelope = document.getElementById('envelope');
  const letter = document.getElementById('letter');
  const letterBody = document.getElementById('letter-body');
  const letterSign = document.getElementById('letter-sign');
  const resealBtn = document.getElementById('reseal-btn');
  let typeTimer = null;

  function typeLetter() {
    letterBody.textContent = '';
    letterBody.classList.add('is-typing');
    letterSign.hidden = true;
    if (typeTimer) clearInterval(typeTimer);
    if (state.reduceMotion) {
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
    if (typeTimer) {
      clearInterval(typeTimer);
      typeTimer = null;
    }
    letterBody.textContent = '';
    letterBody.classList.remove('is-typing');
    letterSign.hidden = true;
    document.getElementById('letter-lede').textContent = 'Tap the seal when you’re ready.';
  }

  envelope.addEventListener('click', openMail);
  resealBtn.addEventListener('click', closeMail);
}
