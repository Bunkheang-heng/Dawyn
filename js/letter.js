import { state } from './state.js';
import { burst, launchConfetti } from './effects.js';

const LETTER = `Dear Toothless Nhi,

It’s crazy how we first met back in AUS, but honestly im really glad that we did. Getting to know someone like you have been one of those many little things im truly grateful for. And I know how much warmth and happiness you bring to people around you just by being “you”.
As you step into 19, I hope this year brings you happiness, good memories, joy, and of course plenty reason to smiles. May the things you’ve been wishing for, all slowly find their way to you. Can can can?
Andd honestly,  I really hope we see each other again, maybe in Cambodia next time. But hey, like I’ve been saying come as a traveller not as someone who got kidnapped =))) (Cambodia is safe btw im just joking, don’t scare of Cambodia please 🙏). I’d openly welcomed you la.
Here’s to turning 19 and all the amazing years ahead of you. I hope you have the happiest of the happiest birthday ever and all the amazing years ahead.
  Happy Birthday again, Nhi. Take care and keep being you. 🌷`;

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
