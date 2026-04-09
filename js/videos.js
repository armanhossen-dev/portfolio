const VIDEOS = [
    { title: 'Portfolio Build Process', meta: 'Dev · Mar 2025 · 2:34', src: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { title: 'Fitness Chatbot Demo', meta: 'AI · Jan 2025 · 4:11', src: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { title: '3D Web Experience', meta: '3D · Dec 2024 · 1:58', src: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { title: 'UnlockedStudio v4.0', meta: 'Studio · Nov 2024 · 3:27', src: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  ];

  const PHOTO_COLORS = [
    '#0e4429','#006d32','#26a641','#85eb18',
    '#0e4429','#006d32','#26a641','#85eb18',
    '#0e4429','#006d32','#26a641','#85eb18',
  ];
  const PHOTO_LABELS = [
    'DIU Campus','Coding Session','Project Showcase','Hackathon 2024',
    'Workshop','Design Sprint','Night Coding','Team Collab',
    'Blender Art','Web Launch','Open Source','Achievement',
  ];

  // Build infinite photo strip (triplicated)
  const track = document.getElementById('stripTrack');
  const PHOTO_COUNT = 12;
  const allPhotos = [...PHOTO_LABELS, ...PHOTO_LABELS, ...PHOTO_LABELS];

  allPhotos.forEach((label, i) => {
    const el = document.createElement('div');
    el.className = 'strip-photo';
    const idx = i % PHOTO_COUNT;
    el.innerHTML = `<div class="strip-photo-placeholder" style="background:${PHOTO_COLORS[idx]}22">
      <div class="ph-icon" style="color:${PHOTO_COLORS[idx]};filter:brightness(2)">&#128247;</div>
      <div class="ph-num" style="color:${PHOTO_COLORS[idx]};filter:brightness(1.5);font-size:0.55rem;letter-spacing:1px;font-family:'Russo One',sans-serif">${label}</div>
    </div>`;
    track.appendChild(el);
  });

  const ITEM_W = 209;
  let stripOffset = PHOTO_COUNT;
  const visibleCount = () => Math.floor(track.parentElement.offsetWidth / ITEM_W) || 3;

  function setStripPos(animate) {
    track.style.transition = animate ? 'transform 0.45s cubic-bezier(0.4,0,0.2,1)' : 'none';
    track.style.transform = `translateX(-${stripOffset * ITEM_W}px)`;
  }

  setStripPos(false);

  document.getElementById('stripRight').onclick = () => {
    stripOffset++;
    setStripPos(true);
    setTimeout(() => {
      if (stripOffset >= PHOTO_COUNT * 2) {
        stripOffset = PHOTO_COUNT + (stripOffset - PHOTO_COUNT * 2);
        setStripPos(false);
      }
    }, 450);
  };

  document.getElementById('stripLeft').onclick = () => {
    stripOffset--;
    setStripPos(true);
    setTimeout(() => {
      if (stripOffset < PHOTO_COUNT) {
        stripOffset = PHOTO_COUNT * 2 - (PHOTO_COUNT - stripOffset);
        setStripPos(false);
      }
    }, 450);
  };

  // Auto-scroll strip
  setInterval(() => {
    document.getElementById('stripRight').onclick();
  }, 3200);

  // Modal
  const modal = document.getElementById('modalBackdrop');
  const vid   = document.getElementById('modalVideo');
  const fill  = document.getElementById('ctrlFill');
  const timeEl = document.getElementById('ctrlTime');

  function fmt(s) {
    s = Math.floor(s || 0);
    return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
  }

  vid.addEventListener('timeupdate', () => {
    if (!vid.duration) return;
    fill.style.width = (vid.currentTime / vid.duration * 100) + '%';
    timeEl.textContent = `${fmt(vid.currentTime)} / ${fmt(vid.duration)}`;
  });

  function openModal(idx) {
    const v = VIDEOS[idx];
    document.getElementById('modalTitle').textContent = v.title;
    document.getElementById('modalMeta').textContent = v.meta;
    vid.src = v.src;
    vid.load();
    vid.play().catch(()=>{});
    updatePlayIcon();
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    vid.pause();
    document.body.style.overflow = '';
  }

  function handleBackdropClick(e) {
    if (e.target === modal) closeModal();
  }

  function updatePlayIcon() {
    const ico = document.getElementById('playIcon');
    if (vid.paused) {
      ico.innerHTML = '<polygon points="4,3 14,8 4,13" fill="var(--accent)"/>';
    } else {
      ico.innerHTML = '<rect x="3" y="3" width="3" height="10" rx="1" fill="var(--accent)"/><rect x="8" y="3" width="3" height="10" rx="1" fill="var(--accent)"/>';
    }
  }

  function togglePlay() {
    vid.paused ? vid.play() : vid.pause();
    updatePlayIcon();
  }

  function restartVideo() { vid.currentTime = 0; vid.play(); updatePlayIcon(); }

  let muted = true;
  function toggleMute() {
    muted = !muted;
    vid.muted = muted;
    document.getElementById('volSlider').value = muted ? 0 : 0.7;
    if (!muted) vid.volume = 0.7;
    const ico = document.getElementById('muteIcon');
    if (muted) {
      ico.innerHTML = `<path d="M2 5h3l4-3v12l-4-3H2z" stroke="var(--muted)" stroke-width="1.2" stroke-linejoin="round"/><line x1="10" y1="5" x2="14" y2="9" stroke="#e55" stroke-width="1.2" stroke-linecap="round"/><line x1="14" y1="5" x2="10" y2="9" stroke="#e55" stroke-width="1.2" stroke-linecap="round"/>`;
    } else {
      ico.innerHTML = `<path d="M2 5h3l4-3v12l-4-3H2z" stroke="var(--muted)" stroke-width="1.2" stroke-linejoin="round"/><path d="M11 4.5c1.2 1.2 1.2 3.8 0 5" stroke="var(--accent)" stroke-width="1.2" stroke-linecap="round"/>`;
    }
  }

  function setVolume(v) {
    vid.volume = parseFloat(v);
    vid.muted = parseFloat(v) === 0;
    muted = vid.muted;
  }

  function seekVideo(e) {
    const bar = document.getElementById('ctrlProgress');
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (vid.duration) vid.currentTime = ratio * vid.duration;
  }

  document.addEventListener('keydown', e => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === ' ') { e.preventDefault(); togglePlay(); }
  });
