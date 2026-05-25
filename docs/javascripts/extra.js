(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function revealAll() {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
  }

  function harden() {
    // ARIA: label buttons missing accessible names
    const searchBtn = document.querySelector('.md-search__button[aria-label="Search"]');
    if (searchBtn && !searchBtn.hasAttribute('aria-label')) {
      searchBtn.setAttribute('aria-label', 'Open search');
    }

    const backToTop = document.querySelector('.md-top');
    if (backToTop && !backToTop.hasAttribute('aria-label')) {
      backToTop.setAttribute('aria-label', 'Back to top');
    }

    // ARIA: patch search combobox with required attributes
    const searchInput = document.querySelector('.md-search__input');
    if (searchInput && searchInput.getAttribute('role') === 'combobox') {
      if (!searchInput.hasAttribute('aria-expanded')) {
        searchInput.setAttribute('aria-expanded', 'false');
      }
      const results = document.querySelector('.md-search-result__list');
      if (results && !searchInput.hasAttribute('aria-controls')) {
        const id = results.id || 'md-search-results';
        results.id = id;
        searchInput.setAttribute('aria-controls', id);
      }
    }
  }

  function brand(theme) {
    const logo = document.querySelector('.md-logo');
    if (!logo) return;
    const scheme = theme || document.body.getAttribute('data-md-color-scheme');
    const isDark = scheme !== 'default';
    const gold = isDark ? '#E8B830' : '#C4961A';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 32 32');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('width', '24');
    svg.setAttribute('height', '24');

    // Three M-waves (Bebop curves)
    const waves = [
      // Wave 1: full width, two peaks
      'M 3,8.5 C 5.5,5.5 8.5,5.5 11,8.5 C 13.5,11.5 16.5,11.5 19,8.5 C 21.5,5.5 24.5,5.5 27,8.5',
      // Wave 2: shorter, asymmetric indent
      'M 5,16 C 7.5,13 10,13 12.5,16 C 15,19 17.5,19 20,16 C 22.5,13 24,13 25,16',
      // Wave 3: ends before diamond
      'M 3,23 C 5.5,20 8,20 11,23 C 13.5,26 16,26 18.5,23 C 21,20 23,20 24,23',
    ];
    waves.forEach(d => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      path.setAttribute('stroke', gold);
      path.setAttribute('stroke-width', '4');
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('fill', 'none');
      svg.appendChild(path);
    });



    const old = logo.querySelector('svg');
    if (old) old.replaceWith(svg);
    else logo.appendChild(svg);
  }

  function brandInit() {
    requestAnimationFrame(() => requestAnimationFrame(() => brand()));
    // Watch for theme toggles
    new MutationObserver(mutations => {
      for (const m of mutations) {
        if (m.attributeName === 'data-md-color-scheme') {
          brand(document.body.getAttribute('data-md-color-scheme'));
        }
      }
    }).observe(document.body, { attributes: true, attributeFilter: ['data-md-color-scheme'] });
  }

  function setup() {
    harden();
    brandInit();

    // Mark elements to animate
    const selectors = [
      '.hero-subtitle', '.hero-actions',
      '.grid.cards li', 'h2', '.md-typeset hr',
      '.md-typeset pre', '.md-typeset table',
      '.md-content > .md-button',
    ];
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => el.classList.add('reveal'));
    });

    // Stagger grid cards
    document.querySelectorAll('.grid.cards').forEach(grid => {
      grid.querySelectorAll('li').forEach((li, i) => {
        li.style.setProperty('--reveal-delay', `${i * 0.08}s`);
      });
    });

    // Stagger hero buttons
    document.querySelectorAll('.hero-actions .md-button').forEach((btn, i) => {
      btn.style.setProperty('--reveal-delay', `${0.1 + i * 0.08}s`);
    });

    // Skip animation if user prefers reduced motion or no IntersectionObserver
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

    // Double rAF to ensure layout is settled
    requestAnimationFrame(() => requestAnimationFrame(() => {
      document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }));
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', setup)
    : setup();
})();
