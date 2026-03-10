
// preloader
const preCount = document.getElementById('preCount');
const line = document.getElementById('preloadLine');
let count = 0;
const iv = setInterval(() => {
  count += Math.floor(Math.random() * 10) + 1;
  if (count >= 100) { count = 100; clearInterval(iv); }
  preCount.textContent = count;
}, 80);
setTimeout(() => { line.style.width = '100%'; }, 100);
setTimeout(() => { document.getElementById('preloader').classList.add('hidden'); }, 2000);

// header scroll
window.addEventListener('scroll', () => {
  document.getElementById('header').classList.toggle('scrolled', window.scrollY > 50);
});

// mobile nav
const menuBtn    = document.getElementById('menuBtn');
const mobileNav  = document.getElementById('mobileNav');
const menuIconEl = document.getElementById('menuIcon');

menuBtn.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
  menuIconEl.className = mobileNav.classList.contains('open')
    ? 'fa-solid fa-xmark'
    : 'fa-solid fa-bars';
});
mobileNav.addEventListener('click', (e) => {
  if (!e.target.closest('a')) {
    mobileNav.classList.remove('open');
    menuIconEl.className = 'fa-solid fa-bars';
  }
});
document.querySelectorAll('.mn-link').forEach(a => {
  a.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    menuIconEl.className = 'fa-solid fa-bars';
  });
});

// typed
new Typed('#typed', {
  strings: ['Dreamer', 'Student', 'Programmer', 'Developer', 'Thinker', 'Gamer', 'Innovator'],
  typeSpeed: 50, backSpeed: 50, loop: true
});

// scroll reveal
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

//set per-card stagger delay on edu-cards before observing ──
document.querySelectorAll('.edu-card.reveal').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.1}s`;
});
reveals.forEach(r => io.observe(r));

// contact form
const scriptURL = "https://script.google.com/macros/s/AKfycbwbB_-7VS_lS9tehAI20iYgdDxGKHE0NSfIZS6FPFXvUjpjPD84qavwJnKAF_5wFTGd/exec";
const form    = document.getElementById('contactForm');
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
    await fetch(scriptURL, { method: 'POST', body: fd, mode: 'no-cors' });
    // no-cors = opaque response, can't read it — just assume success if no throw
    sendBtn.innerHTML = '<i class="fa-solid fa-check"></i> Sent!';
    form.reset();
  } catch {
    sendBtn.innerHTML = '<i class="fa-solid fa-xmark"></i> Failed — check your connection';
  }

  setTimeout(() => {
    sendBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
    sendBtn.disabled  = false;
  }, 2000);
});

// theme toggle
const themeToggle = document.getElementById('themeToggle');

// safely load saved theme on page start
try {
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
  }
} catch(e) {}

// toggle on click
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  try {
    localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
  } catch(e) {}
});