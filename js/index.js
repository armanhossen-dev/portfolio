
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
const scriptURL = "https://script.google.com/macros/s/AKfycbwsVDeZ4jFWNNT5RjSc-jnYhjRLX8-rQ3tA2VJrxOvx-Sqf4kQCAXkElENjVq60-FD0Qg/exec";

const form    = document.getElementById('contactForm');
const sendBtn = document.getElementById('sendBtn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name    = document.getElementById('nameBox').value.trim();
  const email   = document.getElementById('emailBox').value.trim();
  const budget  = document.querySelector('input[name="budget"]:checked')?.value || 'Not specified';
  const message = document.getElementById('messageBox').value.trim();

  if (!name || !email || !message) return;

  sendBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';
  sendBtn.disabled  = true;

  const fd = new FormData();
  fd.append('name',    name);
  fd.append('email',   email);
  fd.append('budget',  budget);
  fd.append('message', message);

  try {
    await fetch(scriptURL, { method: 'POST', body: fd, mode: 'no-cors' });
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

// Theme toggle
const themeToggle = document.getElementById('themeToggle');

// Load saved theme on page start
try {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    themeToggle.checked = true;
  } else {
    document.body.classList.remove('light-mode');
    themeToggle.checked = false;
  }
} catch(e) {}

// Toggle on change
themeToggle.addEventListener('change', () => {
  document.body.classList.toggle('light-mode', themeToggle.checked);
  try {
    localStorage.setItem('theme', themeToggle.checked ? 'light' : 'dark');
  } catch(e) {}
});


// my github contributions
(function () {
  const USERNAME  = 'armanhossen-dev';
  const MONTHS    = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const today     = new Date();
  const grid      = document.getElementById('weeksGrid');
  const monthsRow = document.getElementById('monthsRow');
  const countEl   = document.getElementById('totalCount');

  // ── Tooltip
  const tip = document.createElement('div');
  tip.className = 'contrib-tooltip';
  document.body.appendChild(tip);

  // ── Build grid skeleton instantly (level 0 cells)
  const start = new Date(today);
  start.setDate(start.getDate() - 364 - start.getDay());

  const allCells = []; // store refs to update later
  let lastMonth  = -1;

  for (let w = 0; w < 53; w++) {
    const wDate = new Date(start);
    wDate.setDate(start.getDate() + w * 7);
    const m     = wDate.getMonth();
    const mSpan = document.createElement('span');
    if (m !== lastMonth) { mSpan.textContent = MONTHS[m]; lastMonth = m; }
    monthsRow.appendChild(mSpan);

    const col = document.createElement('div');
    col.className = 'contrib-week';

    for (let d = 0; d < 7; d++) {
      const date   = new Date(start);
      date.setDate(start.getDate() + w * 7 + d);
      const future = date > today;

      const cell        = document.createElement('div');
      cell.className    = 'contrib-cell skeleton';
      cell.dataset.level = '0';
      if (future) cell.style.opacity = '0.15';

      cell.addEventListener('mousemove', e => {
        const count = parseInt(cell.dataset.count || '0');
        const ds    = date.toLocaleDateString('en-US', {
          weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
        });
        tip.style.display = 'block';
        tip.style.left    = (e.clientX + 14) + 'px';
        tip.style.top     = (e.clientY - 38) + 'px';
        tip.innerHTML     = count
          ? `<strong>${count} contribution${count > 1 ? 's' : ''}</strong> on ${ds}`
          : `No contributions on ${ds}`;
      });
      cell.addEventListener('mouseleave', () => { tip.style.display = 'none'; });

      col.appendChild(cell);
      allCells.push({ cell, date, future });
    }
    grid.appendChild(col);
  }

  // ── Check localStorage cache
  const CACHE_KEY  = 'gh_contrib_data';
  const CACHE_TIME = 'gh_contrib_time';
  const ONE_HOUR   = 60 * 60 * 1000;
  const cached     = localStorage.getItem(CACHE_KEY);
  const cachedAt   = localStorage.getItem(CACHE_TIME);
  const isStale    = !cachedAt || (Date.now() - Number(cachedAt)) > ONE_HOUR;

  if (cached && !isStale) {
    renderData(JSON.parse(cached));
  } else {
    fetch(`https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`)
      .then(r => r.json())
      .then(data => {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(CACHE_TIME, Date.now());
        renderData(data);
      })
      .catch(() => { countEl.textContent = '—'; });
  }

  function renderData(data) {
    const map   = {};
    data.contributions.forEach(d => { map[d.date] = { count: d.count, level: d.level }; });
    const total = data.total.lastYear ?? Object.values(data.total).reduce((a, b) => a + b, 0);

    allCells.forEach(({ cell, date, future }) => {
      if (future) return;
      const key  = date.toISOString().split('T')[0];
      const info = map[key] || { count: 0, level: 0 };

      cell.dataset.level = info.level;
      cell.dataset.count = info.count;
      cell.classList.remove('skeleton');
    });

    // Animate counter
    let c = 0;
    const step = Math.ceil(total / 60);
    const t = setInterval(() => {
      c = Math.min(c + step, total);
      countEl.textContent = c.toLocaleString();
      if (c >= total) clearInterval(t);
    }, 20);
  }
})();


// ── Vertical Sticky Social Bar + Logo ──
(function () {
  const bar       = document.getElementById('stickySocial');
  const about     = document.getElementById('about');
  const interests = document.getElementById('interests');
  const footer    = document.querySelector('footer');

  window.addEventListener('scroll', () => {
    const scrollY      = window.scrollY;
    const aboutTop     = about.offsetTop - 100;
    const interestsEnd = interests.offsetTop + interests.offsetHeight;
    const footerTop    = footer.offsetTop - 100;

    if (scrollY >= aboutTop && scrollY <= interestsEnd && scrollY < footerTop) {
      bar.classList.add('visible');
    } else {
      bar.classList.remove('visible');
    }
  });
})();

// ── Floating Nav Tooltip ──
(function () {
  const tip   = document.createElement('div');
  tip.className = 'fnav-tooltip';
  document.body.appendChild(tip);

  document.querySelectorAll('.fnav-item').forEach(item => {
    item.addEventListener('mouseenter', e => {
      const label = item.getAttribute('data-tip');
      if (!label) return;
      tip.textContent = label;
      tip.classList.add('show');

      const rect = item.getBoundingClientRect();
      tip.style.left = (rect.left + rect.width / 2 - tip.offsetWidth / 2) + 'px';
      tip.style.top  = (rect.bottom + 10) + 'px';
    });

    item.addEventListener('mouseleave', () => {
      tip.classList.remove('show');
    });
  });
})();

(function () {
  const items    = document.querySelectorAll('.fnav-item');
  const sections = ['home','about','skills','github','projects','edu','resume','interests','contact'];

  function updateActive() {
    const scrollY = window.scrollY;
    let current   = 'home';

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      if (scrollY >= el.offsetTop - 200) current = id;
    });

    items.forEach(item => {
      const href = item.getAttribute('href').replace('#', '');
      item.classList.toggle('active', href === current);
    });Z
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive(); /* run once on load */
})();