// Page fade-in on load
window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.remove('preload');
});

// Theme handling
(function theme() {
  const root = document.documentElement;
  const btn = document.querySelector('.theme-toggle');
  const stored = localStorage.getItem('theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const initial = stored || (prefersLight ? 'light' : 'dark');
  root.setAttribute('data-theme', initial);
  if (btn) btn.setAttribute('aria-pressed', String(initial === 'light'));
  const toggle = () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    // Persist and notify other tabs
    localStorage.setItem('theme', next);
    if (btn) btn.setAttribute('aria-pressed', String(next === 'light'));
  };
  btn?.addEventListener('click', toggle);

  // Sync theme across tabs
  window.addEventListener('storage', (e) => {
    if (e.key === 'theme' && e.newValue) {
      root.setAttribute('data-theme', e.newValue);
      if (btn) btn.setAttribute('aria-pressed', String(e.newValue === 'light'));
    }
  });
})();

// Rotate roles in hero
(function rolesCarousel() {
  const roles = Array.from(document.querySelectorAll('.roles .role'));
  if (!roles.length) return;
  let i = 0;
  setInterval(() => {
    roles.forEach(r => r.classList.remove('active'));
    roles[i % roles.length].classList.add('active');
    i++;
  }, 2200);
})();

// Reveal on scroll
(function revealOnScroll() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    })
  }, { threshold: 0.15 });
  items.forEach(el => io.observe(el));
})();

// Active nav link on scroll
(function activeNav() {
  const links = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  const sections = links
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);
  if (!('IntersectionObserver' in window) || !sections.length) return;
  const map = new Map(sections.map((s) => [s.id, links.find(a => a.getAttribute('href') === `#${s.id}`)]));
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      const id = e.target.id;
      const link = map.get(id);
      if (!link) return;
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    })
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });
  sections.forEach(s => io.observe(s));
})();

// Copy email
document.getElementById('copyEmail')?.addEventListener('click', (e) => {
  const btn = e.currentTarget;
  const email = btn.getAttribute('data-email') || '';
  navigator.clipboard?.writeText(email).then(() => {
    const prev = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => (btn.textContent = prev), 1200);
  });
});

// Footer year
document.getElementById('year').textContent = String(new Date().getFullYear());

// Back to top smooth
document.querySelector('.back-to-top')?.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Mobile menu
(function mobileMenu(){
  const btn = document.querySelector('.nav-toggle');
  if(!btn) return;
  const toggle = () => {
    const open = document.body.classList.toggle('nav-open');
    btn.setAttribute('aria-expanded', String(open));
  };
  btn.addEventListener('click', toggle);
  document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => {
    if (document.body.classList.contains('nav-open')) toggle();
  }));
})();
