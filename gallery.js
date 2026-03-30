// Detect which page we're on
const isPaintings = window.location.pathname.includes('paintings');
const isCushions = window.location.pathname.includes('cushions');

const gallery = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
let currentItems = [];
let currentIndex = 0;

// ==================
// Flowing Paint Strokes Background
// ==================
const gCanvas = document.getElementById('galleryCanvas');
if (gCanvas) {
  const gCtx = gCanvas.getContext('2d');
  const strokes = [];
  let time = 0;

  const palettes = {
    paintings: [
      '#c0624a22', '#e8c17022', '#4a8c8222', '#8b5c7a22',
      '#d4856e18', '#d4a05418', '#5ca89c18', '#a0688818'
    ],
    cushions: [
      '#e8c17025', '#6aab9e20', '#d4856e20', '#b07da020',
      '#c4a97d18', '#4a8c8218', '#e0785018', '#c0624a15'
    ]
  };

  const colors = isPaintings ? palettes.paintings : palettes.cushions;

  function resizeGCanvas() {
    gCanvas.width = window.innerWidth;
    gCanvas.height = window.innerHeight;
  }
  resizeGCanvas();
  window.addEventListener('resize', resizeGCanvas);

  // Create flowing strokes
  for (let i = 0; i < 12; i++) {
    strokes.push({
      points: Array.from({ length: 6 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight
      })),
      color: colors[Math.floor(Math.random() * colors.length)],
      width: Math.random() * 60 + 20,
      speed: Math.random() * 0.3 + 0.1,
      offset: Math.random() * Math.PI * 2
    });
  }

  // Create drifting color orbs
  const orbs = [];
  for (let i = 0; i < 8; i++) {
    orbs.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 120 + 40,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: Math.random() * 0.15 + 0.05,
      phase: Math.random() * Math.PI * 2
    });
  }

  function drawFlowing() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
    time += 0.005;

    // Draw orbs
    orbs.forEach(orb => {
      orb.phase += 0.003;
      const wobbleX = Math.sin(orb.phase) * 30;
      const wobbleY = Math.cos(orb.phase * 0.7) * 20;

      const gradient = gCtx.createRadialGradient(
        orb.x + wobbleX, orb.y + wobbleY, 0,
        orb.x + wobbleX, orb.y + wobbleY, orb.size
      );
      gradient.addColorStop(0, orb.color);
      gradient.addColorStop(1, 'transparent');

      gCtx.fillStyle = gradient;
      gCtx.beginPath();
      gCtx.arc(orb.x + wobbleX, orb.y + wobbleY, orb.size, 0, Math.PI * 2);
      gCtx.fill();

      orb.x += orb.speedX;
      orb.y -= orb.speedY;

      if (orb.x < -150) orb.x = gCanvas.width + 150;
      if (orb.x > gCanvas.width + 150) orb.x = -150;
      if (orb.y < -150) orb.y = gCanvas.height + 150;
      if (orb.y > gCanvas.height + 150) orb.y = -150;
    });

    // Draw flowing curves
    strokes.forEach(stroke => {
      gCtx.beginPath();
      gCtx.strokeStyle = stroke.color;
      gCtx.lineWidth = stroke.width;
      gCtx.lineCap = 'round';
      gCtx.lineJoin = 'round';

      const pts = stroke.points.map((p, j) => ({
        x: p.x + Math.sin(time * stroke.speed + j + stroke.offset) * 80,
        y: p.y + Math.cos(time * stroke.speed * 0.7 + j * 1.3 + stroke.offset) * 40
      }));

      gCtx.moveTo(pts[0].x, pts[0].y);
      for (let j = 1; j < pts.length - 1; j++) {
        const cx = (pts[j].x + pts[j + 1].x) / 2;
        const cy = (pts[j].y + pts[j + 1].y) / 2;
        gCtx.quadraticCurveTo(pts[j].x, pts[j].y, cx, cy);
      }
      gCtx.stroke();
    });

    requestAnimationFrame(drawFlowing);
  }
  drawFlowing();

}

// ==================
// Gallery Rendering
// ==================
function init() {
  if (isPaintings) {
    renderPaintings(PAINTINGS_DATA);
    setupFilters(PAINTINGS_DATA);
  } else if (isCushions) {
    renderCushions(CUSHIONS_DATA);
  }
  setupLightbox();
  setupNav();
}

function renderPaintings(data) {
  data.sort((a, b) => b.date.localeCompare(a.date));
  currentItems = data;

  gallery.innerHTML = data.map((item, i) => `
    <div class="masonry-item" data-index="${i}" data-tags="${item.tags.join(' ')}">
      <img src="${item.src}" alt="${item.title}" loading="lazy">
      <div class="item-overlay">
        <h3>${item.title}</h3>
        <span>${item.date}</span>
      </div>
    </div>
  `).join('');
}

function renderCushions(data) {
  data.sort((a, b) => b.date.localeCompare(a.date));
  currentItems = data;

  gallery.innerHTML = data.map((item, i) => `
    <div class="cushion-card" data-index="${i}">
      <img src="${item.src}" alt="${item.title}" loading="lazy">
      <div class="cushion-info">
        <h3>${item.title}</h3>
      </div>
    </div>
  `).join('');
}

function setupFilters(data) {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      const items = gallery.querySelectorAll('.masonry-item');

      items.forEach(item => {
        if (filter === 'all' || item.dataset.tags.includes(filter)) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
}

// ==================
// Lightbox with floating color blobs
// ==================
const blobColors = [
  'rgba(192, 98, 74, 0.45)', 'rgba(74, 140, 130, 0.4)',
  'rgba(232, 193, 112, 0.4)', 'rgba(139, 92, 122, 0.45)',
  'rgba(212, 133, 110, 0.35)', 'rgba(106, 171, 158, 0.35)',
  'rgba(224, 120, 80, 0.4)', 'rgba(176, 125, 160, 0.35)'
];
let blobAnimFrame = null;
let blobs = [];

function createLightboxBlobs() {
  const container = document.getElementById('lightboxBlobs');
  if (!container) return;
  container.innerHTML = '';
  blobs = [];

  for (let i = 0; i < 15; i++) {
    const div = document.createElement('div');
    div.className = 'lightbox-blob';
    const size = Math.random() * 150 + 80;
    div.style.width = size + 'px';
    div.style.height = size + 'px';
    div.style.background = blobColors[Math.floor(Math.random() * blobColors.length)];
    container.appendChild(div);

    blobs.push({
      el: div,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: size
    });
  }
}

function animateBlobs() {
  blobs.forEach(b => {
    b.x += b.vx;
    b.y += b.vy;

    if (b.x < -b.size) b.x = window.innerWidth + b.size / 2;
    if (b.x > window.innerWidth + b.size) b.x = -b.size / 2;
    if (b.y < -b.size) b.y = window.innerHeight + b.size / 2;
    if (b.y > window.innerHeight + b.size) b.y = -b.size / 2;

    b.el.style.left = b.x + 'px';
    b.el.style.top = b.y + 'px';
  });
  blobAnimFrame = requestAnimationFrame(animateBlobs);
}

function setupLightbox() {
  gallery.addEventListener('click', (e) => {
    const card = e.target.closest('.masonry-item, .cushion-card');
    if (!card) return;
    currentIndex = parseInt(card.dataset.index);
    openLightbox();
  });

  document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  document.querySelector('.lightbox-prev').addEventListener('click', () => navigate(-1));
  document.querySelector('.lightbox-next').addEventListener('click', () => navigate(1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });
}

function openLightbox() {
  const item = currentItems[currentIndex];
  lightboxImg.src = item.src;
  lightboxImg.alt = item.title;
  lightboxCaption.textContent = `${item.title} — ${item.date}`;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';

  createLightboxBlobs();
  animateBlobs();
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  if (blobAnimFrame) cancelAnimationFrame(blobAnimFrame);
}

function navigate(dir) {
  const visibleItems = gallery.querySelectorAll('.masonry-item:not(.hidden), .cushion-card:not(.hidden)');
  if (visibleItems.length === 0) return;

  const visibleIndices = Array.from(visibleItems).map(el => parseInt(el.dataset.index));
  const currentPos = visibleIndices.indexOf(currentIndex);

  let newPos = currentPos + dir;
  if (newPos < 0) newPos = visibleIndices.length - 1;
  if (newPos >= visibleIndices.length) newPos = 0;

  currentIndex = visibleIndices[newPos];
  openLightbox();
}

function setupNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('active');
    });
  }

  window.addEventListener('scroll', () => {
    const nav = document.getElementById('nav');
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
}

init();
