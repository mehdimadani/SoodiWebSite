// Detect which page we're on
const isPaintings = window.location.pathname.includes('paintings');
const isCushions = window.location.pathname.includes('cushions');

const gallery = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
let currentItems = [];
let currentIndex = 0;

// Load data and render
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
  // Sort newest first
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
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function navigate(dir) {
  // For paintings with filter, only navigate visible items
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

  // Scroll effect
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
