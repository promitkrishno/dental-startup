export function initComparer() {
  const stage = document.getElementById('compare-stage');
  const range = document.getElementById('compare-range');
  const card = document.getElementById('compare-card');
  if (!stage || !range || !card) return;

  const revealText = (value) => `${value}%`;
  const setPosition = () => {
    const value = range.value;
    stage.style.setProperty('--pos', `${value}%`);
    range.setAttribute('aria-valuetext', revealText(value));
  };

  range.addEventListener('input', setPosition);
  setPosition();

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  card.addEventListener('pointermove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    card.style.setProperty('--ry', `${(x - 0.5) * 9}deg`);
    card.style.setProperty('--rx', `${(0.5 - y) * 7}deg`);
    card.style.setProperty('--gx', `${x * 100}%`);
    card.style.setProperty('--gy', `${y * 100}%`);
    card.style.setProperty('--glare', '1');
  });

  card.addEventListener('pointerleave', () => {
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
    card.style.setProperty('--glare', '0');
  });
}
