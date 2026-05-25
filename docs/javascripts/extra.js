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
    const red  = '#D44B3A';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 32 32');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('width', '24');
    svg.setAttribute('height', '24');

    // Angular bars (no rounded corners — Bebop edge)
    [
      { el: 'rect', a: { x:'3', y:'6', width:'24', height:'5' }, fill: gold },
      { el: 'rect', a: { x:'5', y:'13.5', width:'20', height:'5' }, fill: gold },
      { el: 'rect', a: { x:'3', y:'21', width:'22', height:'5' }, fill: gold },
      // Diamond dot (Red Tail)
      { el: 'polygon', a: { points:'28,23 30,26 28,29 26,26' }, fill: red },
    ].forEach(({ el, a, fill }) => {
      const node = document.createElementNS('http://www.w3.org/2000/svg', el);
      Object.entries(a).forEach(([k, v]) => node.setAttribute(k, v));
      node.setAttribute('fill', fill);
      svg.appendChild(node);
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
