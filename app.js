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

  // Chart cards: staggered slide-up
  document.querySelectorAll('.chart-card').forEach(el => revealObserver.observe(el));

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
  // 12. LIVE PRICE TICKER (simulated)
  // ============================================================
  const basePrice = 30.64;
  const priceEl = document.getElementById('live-price');
  const changeEl = document.getElementById('live-change');
  const volEl = document.getElementById('live-vol');

  function updateTicker() {
    if (!priceEl) return;
    const delta = (Math.random() - 0.48) * 0.35;
    const newPrice = basePrice + delta;
    const pctChange = (delta / basePrice) * 100;
    priceEl.textContent = '$' + newPrice.toFixed(2);
    const sign = delta >= 0 ? '+' : '';
    changeEl.textContent = sign + delta.toFixed(2) + ' (' + sign + pctChange.toFixed(2) + '%)';
    changeEl.className = 'live-change' + (delta < 0 ? ' negative' : '');
    // Simulate volume updates
    if (volEl) {
      const vol = (4.2 + Math.random() * 1.5).toFixed(1);
      volEl.textContent = vol + 'M';
    }
  }

  updateTicker();
  setInterval(updateTicker, 4000);

  // ============================================================
  // 14. BACKGROUND STOCK CHART (Canvas)
  // ============================================================
  const canvas = document.getElementById('bg-canvas');
  if (canvas && window.innerWidth > 768) {
    const ctx = canvas.getContext('2d');
    let w, h;
    const chartPoints = [];
    const totalPoints = 200;

    // Generate a realistic stock chart path (upward trend with volatility)
    function generateChart() {
      chartPoints.length = 0;
      let price = 15; // start low (IPO)
      for (let i = 0; i < totalPoints; i++) {
        const t = i / totalPoints;
        // Trend: starts at 15, dips to 10, rallies to 45, pulls back to 31
        const trend = 15 + t * 25 * Math.sin(t * Math.PI * 0.9);
        const noise = (Math.random() - 0.5) * 3;
        price = trend + noise;
        chartPoints.push(price);
      }
    }

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    function drawChart() {
      const scrollY = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPct = Math.min(scrollY / Math.max(docH, 1), 1);

      // How many points to draw based on scroll
      const visibleCount = Math.floor(scrollPct * totalPoints) + 10;

      ctx.clearRect(0, 0, w, h);

      if (chartPoints.length === 0) return;

      const minP = Math.min(...chartPoints);
      const maxP = Math.max(...chartPoints);
      const rangeP = maxP - minP || 1;

      // Draw the line
      ctx.beginPath();
      const drawCount = Math.min(visibleCount, totalPoints);
      for (let i = 0; i < drawCount; i++) {
        const x = (i / totalPoints) * w;
        const y = h - ((chartPoints[i] - minP) / rangeP) * h * 0.6 - h * 0.2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      // Stroke the line
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, 'rgba(0, 212, 170, 0.6)');
      grad.addColorStop(0.6, 'rgba(204, 255, 0, 0.5)');
      grad.addColorStop(1, 'rgba(204, 255, 0, 0.3)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Fill area under the line
      if (drawCount > 1) {
        const lastX = ((drawCount - 1) / totalPoints) * w;
        const lastY = h - ((chartPoints[drawCount - 1] - minP) / rangeP) * h * 0.6 - h * 0.2;
        ctx.lineTo(lastX, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        const fillGrad = ctx.createLinearGradient(0, 0, 0, h);
        fillGrad.addColorStop(0, 'rgba(204, 255, 0, 0.04)');
        fillGrad.addColorStop(1, 'rgba(204, 255, 0, 0)');
        ctx.fillStyle = fillGrad;
        ctx.fill();
      }

      // Draw a small dot at the leading edge
      if (drawCount > 1) {
        const tipX = ((drawCount - 1) / totalPoints) * w;
        const tipY = h - ((chartPoints[drawCount - 1] - minP) / rangeP) * h * 0.6 - h * 0.2;
        ctx.beginPath();
        ctx.arc(tipX, tipY, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(204, 255, 0, 0.6)';
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(tipX, tipY, 8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(204, 255, 0, 0.1)';
        ctx.fill();
      }
    }

    generateChart();
    resize();
    drawChart();

    window.addEventListener('resize', () => { resize(); drawChart(); });
    window.addEventListener('scroll', drawChart, { passive: true });
  }

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
