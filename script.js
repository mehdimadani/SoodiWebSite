// ==================
// Watercolor Paint Background
// ==================
const canvas = document.getElementById('paintCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let mouse = { x: -1000, y: -1000 };
  const blobs = [];
  const splashes = [];
  const colors = [
    '#c0624a', '#d4856e', '#e8c170', '#c4a97d',
    '#4a8c82', '#6aab9e', '#8b5c7a', '#b07da0',
    '#e07850', '#d4a054', '#5ca89c', '#a06888'
  ];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = document.body.scrollHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Floating watercolor blobs
  for (let i = 0; i < 18; i++) {
    blobs.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * document.body.scrollHeight,
      size: Math.random() * 80 + 30,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.15,
      opacity: Math.random() * 0.06 + 0.02,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.008 + 0.003
    });
  }

  // Mouse trail paint splashes
  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY + window.scrollY;

    if (Math.random() > 0.7) {
      splashes.push({
        x: mouse.x + (Math.random() - 0.5) * 20,
        y: mouse.y + (Math.random() - 0.5) * 20,
        size: Math.random() * 8 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 0.25,
        life: 1
      });
    }
  });

  function drawBlob(x, y, size, color, opacity) {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.5, color);
    gradient.addColorStop(1, 'transparent');
    ctx.globalAlpha = opacity;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw floating blobs
    blobs.forEach(b => {
      b.pulse += b.pulseSpeed;
      const sizeOffset = Math.sin(b.pulse) * 10;
      const opacityOffset = Math.sin(b.pulse * 0.7) * 0.015;

      drawBlob(b.x, b.y, b.size + sizeOffset, b.color, b.opacity + opacityOffset);

      b.x += b.vx;
      b.y += b.vy;

      if (b.x < -100 || b.x > canvas.width + 100) b.vx *= -1;
      if (b.y < -100 || b.y > canvas.height + 100) b.vy *= -1;
    });

    // Draw and fade mouse splashes
    for (let i = splashes.length - 1; i >= 0; i--) {
      const s = splashes[i];
      drawBlob(s.x, s.y, s.size, s.color, s.opacity * s.life);
      s.life -= 0.008;
      s.size += 0.1;
      if (s.life <= 0) splashes.splice(i, 1);
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
  }
  animate();

  // Resize canvas when page height changes
  const resizeObserver = new ResizeObserver(() => {
    canvas.height = document.body.scrollHeight;
  });
  resizeObserver.observe(document.body);
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
