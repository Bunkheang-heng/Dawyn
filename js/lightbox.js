const photoData = [
  { src: 'asset/singapore/image.png', caption: 'Singapore — the first hello' },
  { src: 'asset/singapore/image2.png', caption: 'Singapore — snacks & little treasures' },
  { src: 'asset/singapore/image3.png', caption: 'Singapore — dancing through the night' },
  { src: 'asset/vietname/IMG_0236.jpg', caption: 'Vietnam — city lights & dinner dreams' },
  { src: 'asset/vietname/IMG_0180.jpg', caption: 'Vietnam — brunch & coffee' },
  { src: 'asset/vietname/IMG_0225.jpg', caption: 'Vietnam — road laughs' },
];

export function initLightbox() {
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
    setTimeout(() => {
      lbImg.src = '';
    }, 200);
  }

  document.querySelectorAll('.shot').forEach(btn => {
    btn.addEventListener('click', () => openLightbox(Number(btn.dataset.photo)));
  });
  document.getElementById('lb-close').addEventListener('click', closeLightbox);
  document.getElementById('lb-prev').addEventListener('click', () => showPhoto(lbIndex - 1));
  document.getElementById('lb-next').addEventListener('click', () => showPhoto(lbIndex + 1));
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPhoto(lbIndex - 1);
    if (e.key === 'ArrowRight') showPhoto(lbIndex + 1);
  });
}
