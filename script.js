// ==================
// Paint Particle Background
// ==================
const canvas = document.getElementById('paintCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const particles = [];
  const colors = ['#c0624a', '#c4a97d', '#4a8c82', '#8b5c7a', '#d4856e', '#e8c170'];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  for (let i = 0; i < 35; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 4 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.3 + 0.1
    });
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

// ==================
// Navigation
// ==================
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
  });
});

// ==================
// Showcase Image Cycling
// ==================
document.querySelectorAll('.showcase-card').forEach(card => {
  const imgs = card.querySelectorAll('.showcase-img');
  if (imgs.length < 2) return;

  let current = 0;
  setInterval(() => {
    imgs[current].style.opacity = '0';
    current = (current + 1) % imgs.length;
    imgs[current].style.opacity = '1';
  }, 3000);
});

// ==================
// Scroll Fade-in Animation
// ==================
const fadeElements = document.querySelectorAll('.showcase-card, .section-title, .section-subtitle, .about-content, .contact-links');
fadeElements.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

fadeElements.forEach(el => observer.observe(el));

// ==================
// Parallax Hero
// ==================
const heroImg = document.querySelector('.hero-image img');
if (heroImg) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroImg.style.transform = `translateY(${scrolled * 0.3}px) scale(1.1)`;
    }
  });
}

// ==================
// Obfuscated Email
// ==================
const el = document.getElementById('emailLink');
const et = document.getElementById('emailText');
if (el && et) {
  const u = 'info', d = 'soodi', t = 'art';
  const addr = u + '@' + d + '.' + t;
  et.textContent = addr;
  el.href = 'mai' + 'lto:' + addr;
}
