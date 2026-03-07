// cursor
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cursor.style.left = mx+'px'; cursor.style.top = my+'px'; });
function animateRing() { rx += (mx-rx)*0.12; ry += (my-ry)*0.12; ring.style.left = rx+'px'; ring.style.top = ry+'px'; requestAnimationFrame(animateRing); }
animateRing();
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => { ring.style.width='56px'; ring.style.height='56px'; });
  el.addEventListener('mouseleave', () => { ring.style.width='36px'; ring.style.height='36px'; });
});

//preloader
const preCount = document.getElementById('preCount');
const line = document.getElementById('preloadLine');
let count = 0;
const iv = setInterval(() => {
  count += Math.floor(Math.random() * 10) + 1;
  if (count >= 100) { count = 100; clearInterval(iv); }
  preCount.textContent = count;
}, 80);
setTimeout(() => { line.style.width = '100%'; }, 100);
setTimeout(() => {
  document.getElementById('preloader').classList.add('hidden');
}, 3000);

// header scroll
window.addEventListener('scroll', () => {
  document.getElementById('header').classList.toggle('scrolled', window.scrollY > 50);
});

//mobile nav
const menuBtn = document.getElementById('menuBtn');
const mobileNav = document.getElementById('mobileNav');
const menuIconEl = document.getElementById('menuIcon');

menuBtn.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
  menuIconEl.className = mobileNav.classList.contains('open')
    ? 'fa-solid fa-xmark'
    : 'fa-solid fa-bars';
});

// close when clicking outside the links
mobileNav.addEventListener('click', (e) => {
  if (!e.target.closest('a')) {
    mobileNav.classList.remove('open');
    menuIconEl.className = 'fa-solid fa-bars';
  }
});

// close when clicking a link
document.querySelectorAll('.mn-link').forEach(a => {
  a.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    menuIconEl.className = 'fa-solid fa-bars';
  });
});

//typed
new Typed('#typed', {
  strings: ['Dreamer', 'Student', 'Programmer', 'Developer', 'Thinker', 'Gamer', 'Innovator'],
  typeSpeed: 60, backSpeed: 50, loop: true
});

//scroll reveal
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(r => io.observe(r));

// contact form
const scriptURL = "https://script.google.com/macros/s/AKfycbwbB_-7VS_lS9tehAI20iYgdDxGKHE0NSfIZS6FPFXvUjpjPD84qavwJnKAF_5wFTGd/exec";
const form = document.getElementById('contactForm');
const sendBtn = document.getElementById('sendBtn');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = document.getElementById('messageBox').value.trim();
  if (!message) return;
  sendBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';
  sendBtn.disabled = true;
  const fd = new FormData();
  fd.append('message', message);
  try {
    const res = await fetch(scriptURL, { method: 'POST', body: fd });
    const data = JSON.parse(await res.text());
    if (res.ok && data.result === 'success') {
      sendBtn.innerHTML = '<i class="fa-solid fa-check"></i> Sent!';
      form.reset();
    } else { sendBtn.innerHTML = '<i class="fa-solid fa-xmark"></i> Error'; }
  } catch { sendBtn.innerHTML = '<i class="fa-solid fa-xmark"></i> Network Error'; }
  setTimeout(() => { sendBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message'; sendBtn.disabled = false; }, 3000);
});

// theme toggle 
const themeToggle = document.getElementById('themeToggle');

// Night mode is default — load saved preference if any
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  document.body.classList.add('light-mode');
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  const isLight = document.body.classList.contains('light-mode');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});