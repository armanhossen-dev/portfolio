
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

// ── GitHub Contributions Grid (Real Data) ──
(function () {
  const USERNAME = 'armanhossen-dev';
  const MONTHS   = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const today    = new Date();

  // Tooltip
  const tooltip = document.createElement('div');
  tooltip.className = 'contrib-tooltip';
  document.body.appendChild(tooltip);

  const grid      = document.getElementById('weeksGrid');
  const monthsRow = document.getElementById('monthsRow');
  const countEl   = document.getElementById('totalCount');

  // Show loading state
  countEl.textContent = '...';

  // fetch(`https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`) 
    fetch(`https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`, {
    headers: { 'cache-control': 'no-cache' }
    })
    .then(res => {
      if (!res.ok) throw new Error('API error');
      return res.json();
    })
    .then(data => {
      const contributions = data.contributions; // [{date, count, level}]
      const total = data.total.lastYear ?? Object.values(data.total).reduce((a, b) => a + b, 0);

      // Build a date → {count, level} map for fast lookup
      const map = {};
      contributions.forEach(d => { map[d.date] = { count: d.count, level: d.level }; });

      // Build 53-week grid aligned to Sunday
      const start = new Date(today);
      start.setDate(start.getDate() - 364 - start.getDay());

      let lastMonth = -1;

      for (let w = 0; w < 53; w++) {
        const col = document.createElement('div');
        col.className = 'contrib-week';

        // Month label for this week's first day
        const wDate = new Date(start);
        wDate.setDate(start.getDate() + w * 7);
        const m = wDate.getMonth();
        const mSpan = document.createElement('span');
        if (m !== lastMonth) { mSpan.textContent = MONTHS[m]; lastMonth = m; }
        monthsRow.appendChild(mSpan);

        for (let d = 0; d < 7; d++) {
          const date = new Date(start);
          date.setDate(start.getDate() + w * 7 + d);
          const isFuture = date > today;

          // Format date as YYYY-MM-DD to match API keys
          const key = date.toISOString().split('T')[0];
          const info = map[key] || { count: 0, level: 0 };

          const cell = document.createElement('div');
          cell.className = 'contrib-cell';
          cell.dataset.level = isFuture ? '0' : info.level;
          if (isFuture) cell.style.opacity = '0.2';

          // Staggered fade-in
          cell.style.opacity = isFuture ? '0.2' : '0';
          setTimeout(() => {
            cell.style.transition = 'opacity 0.4s ease';
            cell.style.opacity = isFuture ? '0.2' : '1';
          }, w * 8 + d * 4);

          // Tooltip
          cell.addEventListener('mousemove', e => {
            const ds = date.toLocaleDateString('en-US', {
              weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
            });
            tooltip.style.display = 'block';
            tooltip.style.left = (e.clientX + 14) + 'px';
            tooltip.style.top  = (e.clientY - 38) + 'px';
            tooltip.innerHTML   = info.count
              ? `<strong>${info.count} contribution${info.count > 1 ? 's' : ''}</strong> on ${ds}`
              : `No contributions on ${ds}`;
          });
          cell.addEventListener('mouseleave', () => { tooltip.style.display = 'none'; });

          col.appendChild(cell);
        }
        grid.appendChild(col);
      }

      // Animated counter
      let c = 0;
      const step = Math.ceil(total / 60);
      const t = setInterval(() => {
        c = Math.min(c + step, total);
        countEl.textContent = c.toLocaleString();
        if (c >= total) clearInterval(t);
      }, 20);
    })
    .catch(() => {
      // Fallback: show a graceful error in the count area
      countEl.textContent = '—';
      const msg = document.createElement('p');
      msg.style.cssText = 'font-size:0.8rem;color:var(--muted);margin-top:1rem;';
      msg.textContent = 'Could not load contribution data. Check your connection.';
      grid.parentElement.parentElement.appendChild(msg);
    });
})();