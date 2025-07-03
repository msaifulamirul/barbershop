// testing.js - Animated real barber icons (SVG) in black & white only

const SVG_ICONS = [
  // Gunting (scissors)
  `<svg viewBox="0 0 64 64" width="1em" height="1em" fill="none" stroke="#111" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="48" r="8"/><circle cx="48" cy="48" r="8"/><line x1="16" y1="48" x2="58" y2="6"/><line x1="48" y1="48" x2="6" y2="6"/><line x1="30" y1="30" x2="34" y2="34"/></svg>`,
  // Razor
  `<svg viewBox="0 0 64 64" width="1em" height="1em" fill="none" stroke="#222" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="28" width="48" height="8" rx="2"/><rect x="44" y="20" width="12" height="24" rx="3"/><rect x="8" y="24" width="8" height="16" rx="2"/><rect x="20" y="30" width="24" height="4" rx="1.5"/></svg>`,
  // Clipper (machine)
  `<svg viewBox="0 0 64 64" width="1em" height="1em" fill="#fff" stroke="#111" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="18" y="10" width="28" height="44" rx="10"/><rect x="24" y="4" width="16" height="8" rx="3"/><rect x="24" y="52" width="16" height="8" rx="3"/><line x1="32" y1="18" x2="32" y2="46"/><line x1="26" y1="18" x2="26" y2="46"/><line x1="38" y1="18" x2="38" y2="46"/></svg>`
];
const ICON_COUNT = 14;

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

function createSvgIcon() {
  const iconWrap = document.createElement('div');
  iconWrap.className = 'bg-icon-svg';
  iconWrap.innerHTML = SVG_ICONS[Math.floor(Math.random() * SVG_ICONS.length)];
  iconWrap.style.position = 'absolute';
  iconWrap.style.left = randomBetween(0, 95) + 'vw';
  iconWrap.style.top = randomBetween(100, 130) + 'vh';
  iconWrap.style.width = randomBetween(2.5, 5.2) + 'rem';
  iconWrap.style.height = iconWrap.style.width;
  iconWrap.style.opacity = randomBetween(0.10, 0.19);
  iconWrap.dataset.speed = randomBetween(0.18, 0.38); // vh per frame
  iconWrap.dataset.direction = Math.random() > 0.5 ? 1 : -1; // kiri/kanan
  iconWrap.dataset.drift = randomBetween(0.05, 0.16); // drift per frame
  iconWrap.dataset.angle = randomBetween(-30, 30);
  iconWrap.style.transform = `rotate(${iconWrap.dataset.angle}deg)`;
  return iconWrap;
}

function animateSvgIcons() {
  const icons = document.querySelectorAll('.bg-icon-svg');
  icons.forEach(icon => {
    let top = parseFloat(icon.style.top);
    let left = parseFloat(icon.style.left);
    let angle = parseFloat(icon.dataset.angle);
    const speed = parseFloat(icon.dataset.speed);
    const drift = parseFloat(icon.dataset.drift) * parseInt(icon.dataset.direction);
    // Move up
    top -= speed;
    left += drift;
    angle += drift * 0.7;
    // Respawn if out of top or out of side
    if (top < -15 || left < -10 || left > 105) {
      top = randomBetween(100, 130);
      left = randomBetween(0, 95);
      icon.style.width = icon.style.height = randomBetween(2.5, 5.2) + 'rem';
      icon.style.opacity = randomBetween(0.10, 0.19);
      icon.dataset.speed = randomBetween(0.18, 0.38);
      icon.dataset.direction = Math.random() > 0.5 ? 1 : -1;
      icon.dataset.drift = randomBetween(0.05, 0.16);
      angle = randomBetween(-30, 30);
    }
    icon.style.top = top + 'vh';
    icon.style.left = left + 'vw';
    icon.dataset.angle = angle;
    icon.style.transform = `rotate(${angle}deg)`;
  });
  requestAnimationFrame(animateSvgIcons);
}

document.addEventListener('DOMContentLoaded', function() {
  const bg = document.querySelector('.bg-icons');
  if (!bg) return;
  bg.innerHTML = '';
  for (let i = 0; i < ICON_COUNT; i++) {
    bg.appendChild(createSvgIcon());
  }
  animateSvgIcons();
}); 