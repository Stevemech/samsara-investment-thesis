/**
 * Samsara Investment Thesis — Interactive Features
 * Smooth scroll, number counters, IntersectionObserver animations, sticky nav
 */

(function () {
  'use strict';

  // ============================================================
  // 1. HAMBURGER MENU
  // ============================================================
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close on nav link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ============================================================
  // 2. STICKY NAV — scrolled state & active section highlighting
  // ============================================================
  const header = document.getElementById('site-header');
  const sections = document.querySelectorAll('section[id]');
  const navLinkElements = document.querySelectorAll('.nav-link');

  function updateNav() {
    const scrollY = window.scrollY;

    // Scrolled state
    if (header) {
      header.classList.toggle('scrolled', scrollY > 50);
    }

    // Active section
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinkElements.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === currentSection);
    });
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // ============================================================
  // 3. SCROLL ANIMATIONS (IntersectionObserver)
  // ============================================================
  const animatedElements = document.querySelectorAll('[data-animate]');

  // Add animation class
  animatedElements.forEach(el => {
    el.classList.add('animate-in');
  });

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  };

  const animateObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Trigger counter if present
        const counter = entry.target.querySelector('[data-count]');
        if (counter && !counter.dataset.counted) {
          animateCounter(counter);
          counter.dataset.counted = 'true';
        }

        animateObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => animateObserver.observe(el));

  // ============================================================
  // 4. NUMBER COUNTER ANIMATION
  // ============================================================
  function animateCounter(el) {
    const target = parseFloat(el.dataset.count);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 800;
    const startTime = performance.now();

    // Determine decimal places
    const decimalPlaces = (target.toString().split('.')[1] || '').length;

    function easeOut(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOut(progress);
      const current = target * easedProgress;

      el.textContent = prefix + current.toFixed(decimalPlaces) + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = prefix + target.toFixed(decimalPlaces) + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  // ============================================================
  // 5. CHART IMAGE FADE-IN
  // ============================================================
  const chartImages = document.querySelectorAll('.chart-card img');

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'scale(1)';
        imageObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -40px 0px'
  });

  chartImages.forEach(img => {
    img.style.opacity = '0';
    img.style.transform = 'scale(0.98)';
    img.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
    imageObserver.observe(img);
  });

  // ============================================================
  // 6. HERO PARALLAX (subtle)
  // ============================================================
  const heroGrid = document.querySelector('.hero-bg-grid');

  if (heroGrid) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroGrid.style.transform = `translateY(${scrollY * 0.3}px)`;
      }
    }, { passive: true });
  }

  // ============================================================
  // 7. SMOOTH SCROLL for all anchor links
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ============================================================
  // 8. LIGHTBOX
  // ============================================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close');

  document.querySelectorAll('.chart-card').forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const caption = card.querySelector('figcaption');
      if (img && lightbox) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = caption ? caption.textContent : '';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // ============================================================
  // 9. SCROLL PROGRESS BAR
  // ============================================================
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      progressBar.style.width = scrollPercent + '%';
    }, { passive: true });
  }

  // ============================================================
  // 10. EXPANDABLE RISK CARDS
  // ============================================================
  document.querySelectorAll('.risk-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('expanded');
    });
  });

  // ============================================================
  // 11. BACK TO TOP
  // ============================================================
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 800);
    }, { passive: true });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();
