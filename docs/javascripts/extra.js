(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ═════════════════════════════════════════════════════
     Logo — monochrome mark
     ═════════════════════════════════════════════════════ */

  function brand(theme) {
    const scheme = theme || document.body.getAttribute('data-md-color-scheme');
    const isDark = scheme !== 'default';
    const ink = isDark ? '#FAFAFA' : '#0A0A0A';
    const inkDim = isDark ? 'rgba(250,250,250,0.25)' : 'rgba(10,10,10,0.2)';

    document.querySelectorAll('.md-logo').forEach(logo => {
      logo.querySelectorAll('svg:not([data-custom-logo])').forEach(s => s.remove());
      if (logo.querySelector('svg[data-custom-logo]')) return;

      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 36 36');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('width', '26');
      svg.setAttribute('height', '26');
      svg.setAttribute('data-custom-logo', '');

      // Outer ring — orbital path
      const ring = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
      ring.setAttribute('cx', '18');
      ring.setAttribute('cy', '18');
      ring.setAttribute('rx', '15');
      ring.setAttribute('ry', '5');
      ring.setAttribute('stroke', inkDim);
      ring.setAttribute('stroke-width', '1');
      ring.setAttribute('stroke-dasharray', '3 4');
      ring.setAttribute('fill', 'none');
      ring.setAttribute('transform', 'rotate(-20 18 18)');
      svg.appendChild(ring);

      // Planet / central circle
      const planet = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      planet.setAttribute('cx', '18');
      planet.setAttribute('cy', '16');
      planet.setAttribute('r', '7');
      planet.setAttribute('stroke', ink);
      planet.setAttribute('stroke-width', '1.5');
      planet.setAttribute('fill', 'none');
      svg.appendChild(planet);

      // Planet horizontal band
      const band = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      band.setAttribute('x1', '12');
      band.setAttribute('y1', '16');
      band.setAttribute('x2', '24');
      band.setAttribute('y2', '16');
      band.setAttribute('stroke', inkDim);
      band.setAttribute('stroke-width', '0.8');
      svg.appendChild(band);

      // Small orbiting moon
      const moon = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      moon.setAttribute('cx', '30');
      moon.setAttribute('cy', '12');
      moon.setAttribute('r', '2');
      moon.setAttribute('fill', ink);
      moon.setAttribute('opacity', '0.7');
      svg.appendChild(moon);

      // Star / sparkle top right
      const sparkle = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      sparkle.setAttribute('d', 'M 8 7 L 8.6 8.6 L 10 9 L 8.6 9.4 L 8 11 L 7.4 9.4 L 6 9 L 7.4 8.6 Z');
      sparkle.setAttribute('fill', ink);
      sparkle.setAttribute('opacity', '0.4');
      svg.appendChild(sparkle);

      logo.appendChild(svg);
    });
  }

  function brandInit() {
    requestAnimationFrame(() => requestAnimationFrame(() => brand()));

    new MutationObserver(mutations => {
      for (const m of mutations) {
        if (m.attributeName === 'data-md-color-scheme') {
          brand(document.body.getAttribute('data-md-color-scheme'));
        }
      }
    }).observe(document.body, { attributes: true, attributeFilter: ['data-md-color-scheme'] });

    let cleanups = 0;
    function pollCleanup() {
      cleanups++;
      brand();
      if (cleanups < 10) setTimeout(pollCleanup, 200);
    }
    function scheduleCleanup() {
      cleanups = 0;
      pollCleanup();
    }

    new MutationObserver(mutations => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node.nodeType === 1) {
            if (node.matches && node.matches('.md-logo')) scheduleCleanup();
            if (node.querySelectorAll) node.querySelectorAll('.md-logo').forEach(() => scheduleCleanup());
          }
        }
      }
    }).observe(document.body, { childList: true, subtree: true });

    scheduleCleanup();
  }

  /* ═════════════════════════════════════════════════════
     Reveal animations
     ═════════════════════════════════════════════════════ */

  function revealAll() {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
  }

  /* ═════════════════════════════════════════════════════
     Accessibility hardening
     ═════════════════════════════════════════════════════ */

  function harden() {
    document.querySelectorAll('.md-search__button:not([aria-label])').forEach(btn => {
      btn.setAttribute('aria-label', btn.title || 'Search');
    });
    const backToTop = document.querySelector('.md-top');
    if (backToTop && !backToTop.hasAttribute('aria-label')) {
      backToTop.setAttribute('aria-label', 'Back to top');
    }
    const searchInput = document.querySelector('.md-search__input');
    if (searchInput && searchInput.getAttribute('role') === 'combobox') {
      if (!searchInput.hasAttribute('aria-expanded')) {
        searchInput.setAttribute('aria-expanded', 'false');
      }
      const patch = () => {
        const results = document.querySelector('.md-search-result__list');
        if (results) {
          if (!results.id) results.id = 'md-search-results';
          if (!searchInput.hasAttribute('aria-controls')) {
            searchInput.setAttribute('aria-controls', results.id);
          }
        }
      };
      patch();
      setTimeout(patch, 500);
    }
  }

  /* ═════════════════════════════════════════════════════
     Setup
     ═════════════════════════════════════════════════════ */

  function setup() {
    harden();
    brandInit();

    const selectors = [
      '.hero-subtitle', '.hero-actions',
      '.grid.cards li', 'h2', '.md-typeset hr',
      '.md-typeset pre', '.md-typeset table',
      '.md-content > .md-button',
    ];
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => el.classList.add('reveal'));
    });

    document.querySelectorAll('.grid.cards').forEach(grid => {
      grid.querySelectorAll('li').forEach((li, i) => {
        li.style.setProperty('--reveal-delay', `${i * 0.08}s`);
      });
    });

    document.querySelectorAll('.hero-actions .md-button').forEach((btn, i) => {
      btn.style.setProperty('--reveal-delay', `${0.1 + i * 0.08}s`);
    });

    if (prefersReduced || !('IntersectionObserver' in window)) {
      return revealAll();
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -12% 0px' });

    requestAnimationFrame(() => requestAnimationFrame(() => {
      document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }));
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', setup)
    : setup();
})();
