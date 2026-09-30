/* ============================================================
   ANDREY'S CONSTRUCTION — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- NAV SCROLL ---------- */
  const nav = document.querySelector('.site-nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* ---------- MOBILE MENU ---------- */
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
      // Animate spans
      const [top, mid, bot] = hamburger.querySelectorAll('span');
      if (open) {
        top.style.transform = 'translateY(7px) rotate(45deg)';
        mid.style.opacity = '0';
        bot.style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        top.style.transform = '';
        mid.style.opacity = '';
        bot.style.transform = '';
      }
    });
    // Close on link click
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.querySelectorAll('span').forEach(s => s.style.transform = s.style.opacity = '');
      });
    });
  }

  /* ---------- ACTIVE NAV LINK ---------- */
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
    const href = a.getAttribute('href').replace(/\/$/, '') || '/';
    if (href === currentPath || (href !== '/' && currentPath.startsWith(href))) {
      a.classList.add('active');
    }
  });

  /* ---------- CONTACT FORM (Netlify) ---------- */
  const form = document.querySelector('.js-contact-form');
  const formSuccess = document.querySelector('.js-form-success');
  const formError = document.querySelector('.js-form-error');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      if (formError) formError.style.display = 'none';
      btn.textContent = 'Sending…';
      btn.disabled = true;
      try {
        const data = new FormData(form);
        const response = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(data).toString()
        });
        if (!response.ok) {
          throw new Error('Form submission failed with status ' + response.status);
        }
        form.style.display = 'none';
        if (formSuccess) formSuccess.style.display = 'block';
        if (typeof gtag === 'function') gtag('event', 'generate_lead');
      } catch (err) {
        btn.textContent = 'Try Again';
        btn.disabled = false;
        if (formError) formError.style.display = 'block';
        console.error('Form error:', err);
      }
    });
  }

  /* ---------- ANALYTICS: PHONE + CTA CLICK TRACKING ---------- */
  document.addEventListener('click', (e) => {
    if (typeof gtag !== 'function') return;

    const telLink = e.target.closest('a[href^="tel:"]');
    if (telLink) {
      gtag('event', 'phone_click', { link_url: telLink.getAttribute('href') });
      return;
    }

    const ctaLink = e.target.closest('a[href="/contact.html"].btn, a[href="/contact.html"].area-link, a[href="/contact"].btn, a[href="/contact"].area-link');
    if (ctaLink) {
      gtag('event', 'cta_click', { link_text: ctaLink.textContent.trim() });
    }
  });

  /* ---------- GALLERY FILTER (Our Work page) ---------- */
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-filterable');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        galleryItems.forEach(item => {
          item.style.display = (filter === 'all' || item.dataset.cat === filter) ? '' : 'none';
        });
      });
    });
  }

  /* ---------- SMOOTH SCROLL FOR ANCHOR LINKS ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- SIMPLE FADE-IN ON SCROLL ---------- */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

});
