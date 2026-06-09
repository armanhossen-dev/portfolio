
// preloader
const preCount = document.getElementById('preCount');
const line = document.getElementById('preloadLine');
let count = 0;
const iv = setInterval(() => {
  count += Math.floor(Math.random() * 10) + 1;
  if (count >= 100) { count = 100; clearInterval(iv); }
  preCount.textContent = count;
}, 90);
setTimeout(() => { line.style.width = '100%'; }, 100);
// setTimeout(() => { document.getElementById('preloader').classList.add('hidden'); }, 2000);

setTimeout(() => {
  const preloader = document.getElementById('preloader');
  const COLS = 6;
  const blocks = [];

  // Build block columns
  for (let i = 0; i < COLS; i++) {
    const b = document.createElement('div');
    b.style.cssText = `
      position: fixed;
      top: 0;
      left: ${(i / COLS) * 100}%;
      width: ${100 / COLS + 0.2}%;
      height: 100%;
      background: #000000d2;
      z-index: 9;
      transform: translateY(0%);
      transition: transform 0.75s cubic-bezier(0.76, 0, 0.24, 1);
      transition-delay: ${i * 0.055}s;
    `;
    document.body.appendChild(b);
    blocks.push(b);
  }

  // Hide the preloader text/line first
  preloader.classList.add('hidden');

  // Then slide blocks up
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      blocks.forEach(b => { b.style.transform = 'translateY(-102%)'; });
    });
  });

  // Clean up blocks from DOM after animation
  setTimeout(() => blocks.forEach(b => b.remove()), 2500);

}, 2500);
