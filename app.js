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
  // 6. HERO SCROLL EFFECTS (Vibor-inspired)
  // ============================================================
  const heroGrid = document.querySelector('.hero-bg-grid');
  const heroHeadline = document.querySelector('.hero-headline');
  const heroContent = document.querySelector('.hero-content');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const vh = window.innerHeight;
    if (scrollY < vh) {
      const progress = scrollY / vh;
      // Scale headline up as you scroll (Vibor zoom effect)
      if (heroHeadline) {
        const scale = 1 + progress * 0.15;
        heroHeadline.style.transform = `scale(${scale}) translateY(${-progress * 20}px)`;
        heroHeadline.style.opacity = 1 - progress * 1.5;
      }
      // Fade out hero content
      if (heroContent) {
        heroContent.style.opacity = 1 - progress * 1.8;
      }
      // Parallax grid
      if (heroGrid) {
        heroGrid.style.transform = `translateY(${scrollY * 0.3}px)`;
      }
    }
  }, { passive: true });

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
  // 10. TEXT REVEAL ANIMATIONS
  // ============================================================
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  // Section titles: clip-path reveal
  document.querySelectorAll('.section-title').forEach(el => revealObserver.observe(el));

  // WORD-BY-WORD REVEAL for section titles
  document.querySelectorAll('.section-title').forEach(title => {
    const text = title.textContent;
    const words = text.split(/(\s+)/);
    title.innerHTML = '';
    title.style.clipPath = 'none';
    title.style.opacity = '1';
    title.style.transform = 'none';
    words.forEach((word, i) => {
      if (word.trim() === '') {
        title.appendChild(document.createTextNode(word));
      } else {
        const span = document.createElement('span');
        span.textContent = word;
        span.className = 'word-reveal';
        span.style.transitionDelay = (i * 0.06) + 's';
        title.appendChild(span);
      }
    });
  });

  // Section labels: slide-in from left
  document.querySelectorAll('.section-label').forEach(el => revealObserver.observe(el));

  // Section intros: fade up
  document.querySelectorAll('.section-intro').forEach(el => revealObserver.observe(el));

  // Scenario cards: staggered entrance
  document.querySelectorAll('.scenario-card').forEach(el => revealObserver.observe(el));

  // Holder cards: trigger bar fill
  document.querySelectorAll('.holder-card').forEach(card => {
    const bar = card.querySelector('.holder-bar');
    if (bar) card.style.setProperty('--bar-w', bar.style.width);
    revealObserver.observe(card);
  });

  // Journey steps: trigger bar fill
  document.querySelectorAll('.journey-step').forEach(el => revealObserver.observe(el));

  // Subsection titles: fade-slide
  document.querySelectorAll('.subsection-title').forEach(el => revealObserver.observe(el));

  // Chart cards: staggered slide-up (add class AFTER images loaded)
  document.querySelectorAll('.chart-card').forEach(el => {
    const img = el.querySelector('img');
    function setupReveal() {
      el.classList.add('will-reveal');
      revealObserver.observe(el);
    }
    if (img && !img.complete) {
      img.addEventListener('load', setupReveal, { once: true });
    } else {
      setupReveal();
    }
  });

  // KPI glow flash when counter finishes
  const origAnimateCounter = animateCounter;
  // Patch: add glow flash at end of count
  document.querySelectorAll('.kpi-value[data-count]').forEach(el => {
    const obs = new MutationObserver(() => {
      if (el.dataset.counted === 'true') {
        el.classList.add('flash');
        setTimeout(() => el.classList.remove('flash'), 600);
        obs.disconnect();
      }
    });
    obs.observe(el, { attributes: true });
  });

  // ============================================================
  // 11. EXPANDABLE RISK CARDS
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

  // ============================================================
  // 12. LIVE PRICE TICKER (simulated cumulative random walk)
  // ============================================================
  const basePrice = 30.64;
  let currentPrice = basePrice;
  const sharesOut = 574; // millions
  const revenue = 1.27; // TTM revenue in billions
  const priceEl = document.getElementById('live-price');
  const changeEl = document.getElementById('live-change');
  const volEl = document.getElementById('live-vol');
  const mcapEl = document.getElementById('live-mcap');
  const evsEl = document.getElementById('live-evs');
  const psEl = document.getElementById('live-ps');
  const hiEl = document.getElementById('live-hi');
  const loEl = document.getElementById('live-lo');

  function updateTicker() {
    if (!priceEl) return;
    // Cumulative random walk with slight upward drift
    const step = (Math.random() - 0.47) * 0.18;
    currentPrice = Math.max(basePrice * 0.92, Math.min(basePrice * 1.08, currentPrice + step));
    const delta = currentPrice - basePrice;
    const pctChange = (delta / basePrice) * 100;
    priceEl.textContent = '$' + currentPrice.toFixed(2);
    const sign = delta >= 0 ? '+' : '';
    changeEl.textContent = sign + delta.toFixed(2) + ' (' + sign + pctChange.toFixed(2) + '%)';
    changeEl.className = 'live-change' + (delta < 0 ? ' negative' : '');
    // Derived stats that move with price
    const mcap = (currentPrice * sharesOut / 1000).toFixed(1);
    if (mcapEl) mcapEl.textContent = '$' + mcap + 'B';
    const ev = currentPrice * sharesOut / 1000 + 0.05; // minimal net debt
    if (evsEl) evsEl.textContent = (ev / revenue).toFixed(1) + 'x';
    if (psEl) psEl.textContent = (currentPrice * sharesOut / 1000 / revenue).toFixed(1) + 'x';
    // Volume with slight variance
    if (volEl) {
      const vol = (4.2 + Math.random() * 1.5).toFixed(1);
      volEl.textContent = vol + 'M';
    }
  }

  updateTicker();
  setInterval(updateTicker, 4000);

  // ============================================================
  // 14. RISING NEON STOCK ARROW
  // ============================================================
  const arrowContainer = document.getElementById('stock-arrow');
  const arrowLine = document.getElementById('arrow-line');
  const arrowTrail = document.getElementById('arrow-trail');
  const arrowHead = document.getElementById('arrow-head');

  if (arrowContainer && arrowLine) {
    // The arrow path: a stock-chart-like upward zigzag
    // x: 0-120, y: 800 (bottom) to 0 (top)
    // As you scroll, the line draws upward with volatility
    const points = [
      [60, 780], [70, 720], [45, 680], [75, 620], [50, 570],
      [80, 510], [40, 460], [70, 400], [55, 350], [85, 290],
      [45, 240], [75, 180], [50, 130], [80, 80], [60, 20]
    ];

    function updateArrow() {
      const scrollY = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct = Math.min(scrollY / Math.max(docH, 1), 1);

      // Show after scrolling a bit
      if (scrollY > 100) {
        arrowContainer.classList.add('visible');
      } else {
        arrowContainer.classList.remove('visible');
      }

      // How many points to show based on scroll
      const count = Math.max(2, Math.floor(pct * points.length) + 2);
      const visible = points.slice(0, Math.min(count, points.length));

      // Build the line path
      let d = 'M ' + visible[0][0] + ' ' + visible[0][1];
      for (let i = 1; i < visible.length; i++) {
        d += ' L ' + visible[i][0] + ' ' + visible[i][1];
      }
      arrowLine.setAttribute('d', d);

      // Build the trail (fill area)
      const lastPt = visible[visible.length - 1];
      const trailD = d + ' L ' + lastPt[0] + ' 800 L ' + visible[0][0] + ' 800 Z';
      arrowTrail.setAttribute('d', trailD);

      // Arrow head at the tip
      const tipX = lastPt[0];
      const tipY = lastPt[1];
      const headSize = 12;
      arrowHead.setAttribute('points',
        `${tipX},${tipY - headSize} ${tipX - headSize * 0.7},${tipY + headSize * 0.5} ${tipX + headSize * 0.7},${tipY + headSize * 0.5}`
      );
    }

    updateArrow();
    window.addEventListener('scroll', updateArrow, { passive: true });
  }

  // ============================================================
  // 14B. MOUSE-TRACKING CARD TILT
  // ============================================================
  document.querySelectorAll('.kpi-card, .stat-callout, .moat-card, .scenario-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });

  // ============================================================
  // 14C. SCROLL-TRIGGERED SECTION COUNTER
  // ============================================================
  let sectionIndex = 0;
  const sectionNames = ['Hero', 'Thesis', 'Financials', 'Management', 'Products', 'Tailwinds', 'Valuation', 'Catalysts', 'Risks', 'Conclusion', 'Paper'];
  const sectionCounter = document.createElement('div');
  sectionCounter.className = 'section-counter';
  sectionCounter.innerHTML = '<span class="sc-num">01</span><span class="sc-sep">/</span><span class="sc-total">11</span>';
  document.body.appendChild(sectionCounter);

  const scNum = sectionCounter.querySelector('.sc-num');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    let idx = 0;
    document.querySelectorAll('section[id]').forEach((s, i) => {
      if (scrollY >= s.offsetTop - 200) idx = i;
    });
    if (idx !== sectionIndex) {
      sectionIndex = idx;
      scNum.textContent = String(idx + 1).padStart(2, '0');
    }
    sectionCounter.classList.toggle('visible', scrollY > 300);
  }, { passive: true });

  // ============================================================
  // 15B. ANIMATED NUMBER COUNTERS (KPI cards, hero stats)
  // ============================================================
  function animateCounter2(el) {
    const target = el.textContent;
    const suffix = target.replace(/[\d.,]/g, '');
    const num = parseFloat(target.replace(/[^\d.]/g, ''));
    if (isNaN(num)) return;
    const duration = 1500;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = num * eased;
      const formatted = current >= 1000 ? Math.round(current).toLocaleString() :
                        current >= 10 ? current.toFixed(1).replace(/\.0$/, '') :
                        current.toFixed(1);
      el.textContent = formatted + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        animateCounter2(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.kpi-value, .hero-stat-value, .stat-number').forEach(el => {
    if (/\d/.test(el.textContent)) counterObserver.observe(el);
  });

  // ============================================================
  // 15. FLOATING EMOJI PARTICLES
  // ============================================================
  const particleContainer = document.getElementById('bg-particles');
  if (particleContainer && window.innerWidth > 768) {
    const emojis = ['📈', '💰', '🚀', '📊', '⚡', '🎯', '💎', '🔒', '🏆', '📡'];
    let lastScroll = 0;
    let particleCount = 0;
    const maxParticles = 15;

    function spawnParticle() {
      if (particleCount >= maxParticles) return;
      const el = document.createElement('span');
      el.className = 'particle';
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.left = (Math.random() * 90 + 5) + '%';
      el.style.top = (Math.random() * 80 + 10) + '%';
      el.style.fontSize = (12 + Math.random() * 8) + 'px';
      el.style.animationDuration = (12 + Math.random() * 18) + 's';
      particleContainer.appendChild(el);
      particleCount++;
      el.addEventListener('animationend', () => {
        el.remove();
        particleCount--;
      });
    }

    // Spawn a few on load
    for (let i = 0; i < 5; i++) {
      setTimeout(() => spawnParticle(), i * 800);
    }

    // Spawn on scroll (throttled)
    window.addEventListener('scroll', () => {
      const diff = Math.abs(window.scrollY - lastScroll);
      if (diff > 300) {
        lastScroll = window.scrollY;
        spawnParticle();
      }
    }, { passive: true });

    // Also spawn periodically
    setInterval(() => {
      if (Math.random() < 0.3) spawnParticle();
    }, 5000);
  }

})();
