// Artwork data for lightbox
const artworks = {
  'steam-clock-at-night': {
    title: 'Steam Clock at Night',
    images: [
      'images/products/steam-clock/steam-clock-1.jpg',
      'images/products/steam-clock/steam-clock-2.jpg'
    ]
  },
  'woman-life-freedom': {
    title: 'Woman Life Freedom',
    images: [
      'images/products/woman-life-freedom/woman-life-freedom-1.jpg',
      'images/products/woman-life-freedom/woman-life-freedom-2.jpg'
    ]
  },
  'girl-born-from-flowers': {
    title: 'Emergence of Elegance: A Girl Born from Flowers',
    images: [
      'images/products/girl-born-flowers/girl-flowers-1.jpg',
      'images/products/girl-born-flowers/girl-flowers-2.jpg',
      'images/products/girl-born-flowers/girl-flowers-3.jpg'
    ]
  },
  'blue-jay-on-the-box': {
    title: 'Blue Jay on the Box',
    images: [
      'images/products/blue-jay-box/blue-jay-1.jpg',
      'images/products/blue-jay-box/blue-jay-2.jpg',
      'images/products/blue-jay-box/blue-jay-3.jpg',
      'images/products/blue-jay-box/blue-jay-4.jpg'
    ]
  },
  'flower-box': {
    title: 'Flower Box',
    images: [
      'images/products/flower-box/flower-box-1.jpg',
      'images/products/flower-box/flower-box-2.jpg',
      'images/products/flower-box/flower-box-3.jpg',
      'images/products/flower-box/flower-box-4.jpg'
    ]
  }
};

// Navigation scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile menu toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('active');
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
  });
});

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxThumbnails = document.getElementById('lightbox-thumbnails');
let currentArtwork = null;
let currentIndex = 0;

function openLightbox(artworkId) {
  currentArtwork = artworks[artworkId];
  currentIndex = 0;
  updateLightbox();
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function updateLightbox() {
  if (!currentArtwork) return;
  lightboxImg.src = currentArtwork.images[currentIndex];
  lightboxImg.alt = currentArtwork.title;
  lightboxCaption.textContent = currentArtwork.title;

  // Update thumbnails
  lightboxThumbnails.innerHTML = '';
  currentArtwork.images.forEach((src, i) => {
    const thumb = document.createElement('img');
    thumb.src = src;
    thumb.alt = `View ${i + 1}`;
    thumb.classList.toggle('active', i === currentIndex);
    thumb.addEventListener('click', () => {
      currentIndex = i;
      updateLightbox();
    });
    lightboxThumbnails.appendChild(thumb);
  });
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  currentArtwork = null;
}

document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
document.querySelector('.lightbox-prev').addEventListener('click', () => {
  if (!currentArtwork) return;
  currentIndex = (currentIndex - 1 + currentArtwork.images.length) % currentArtwork.images.length;
  updateLightbox();
});
document.querySelector('.lightbox-next').addEventListener('click', () => {
  if (!currentArtwork) return;
  currentIndex = (currentIndex + 1) % currentArtwork.images.length;
  updateLightbox();
});

// Close lightbox on backdrop click
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') document.querySelector('.lightbox-prev').click();
  if (e.key === 'ArrowRight') document.querySelector('.lightbox-next').click();
});

// Artwork card click handlers
document.querySelectorAll('.artwork-card').forEach(card => {
  card.addEventListener('click', () => {
    const artworkId = card.dataset.artwork;
    openLightbox(artworkId);
  });
});

// Scroll fade-in animation
const fadeElements = document.querySelectorAll('.artwork-card, .section-title, .section-subtitle, .about-content, .contact-content');
fadeElements.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

fadeElements.forEach(el => observer.observe(el));

// Obfuscated email (anti-scraper)
const el = document.getElementById('emailLink');
const et = document.getElementById('emailText');
if (el && et) {
  const u = 'info', d = 'soodi', t = 'art';
  const addr = u + '@' + d + '.' + t;
  et.textContent = addr;
  el.href = 'mai' + 'lto:' + addr;
}
