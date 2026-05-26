(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Replace favicon with custom SVG
  (function favicon() {
    const link = document.querySelector('link[rel="icon"]');
    if (link) {
      link.href = '/assets/images/favicon.svg';
      link.type = 'image/svg+xml';
    }
  })();

  function revealAll() {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
  }

  function harden() {
    // Label unlabeled search buttons
    document.querySelectorAll('.md-search__button:not([aria-label])').forEach(btn => {
      btn.setAttribute('aria-label', btn.title || 'Search');
    });
    const backToTop = document.querySelector('.md-top');
    if (backToTop && !backToTop.hasAttribute('aria-label')) {
      backToTop.setAttribute('aria-label', 'Back to top');
    }
    // Patch search combobox with required ARIA attributes
    const searchInput = document.querySelector('.md-search__input');
    if (searchInput && searchInput.getAttribute('role') === 'combobox') {
      if (!searchInput.hasAttribute('aria-expanded')) {
        searchInput.setAttribute('aria-expanded', 'false');
      }
      // Wait for search results element (lazy-loaded)
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
      // Retry once after search panel initialization
      setTimeout(patch, 500);
    }
  }

  function brand(theme) {
    const scheme = theme || document.body.getAttribute('data-md-color-scheme');
    const isDark = scheme !== 'default';
    const gold = isDark ? '#F5F5F5' : '#1A1A1A';

    document.querySelectorAll('.md-logo').forEach(logo => {
      logo.querySelectorAll('svg:not([data-custom-logo])').forEach(s => s.remove());
      if (logo.querySelector('svg[data-custom-logo]')) return;

      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 16 16');
      svg.setAttribute('width', '24');
      svg.setAttribute('height', '24');
      svg.setAttribute('shape-rendering', 'crispEdges');
      svg.setAttribute('data-custom-logo', '');

      // Pixel grid (each unit = 1px in 16×16)
      const pixels = [
        // Bar 1 (y:1-2, x:1-14)
        { x:1, y:1, w:14, h:2 },
        // Bar 2 (y:5-6, x:3-12, indented)
        { x:3, y:5, w:10, h:2 },
        // Bar 3 (y:9-10, x:1-12)
        { x:1, y:9, w:12, h:2 },
        // Dot (2×2 at x:13, y:13)
        { x:13, y:13, w:2, h:2 },
      ];
      pixels.forEach(({ x, y, w, h }) => {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', w);
        rect.setAttribute('height', h);
        rect.setAttribute('fill', gold);
        svg.appendChild(rect);
      });
      logo.appendChild(svg);
      logo.appendChild(svg);
    });
  }

  function brandInit() {
    // Initial injection (after MkDocs renders icons)
    requestAnimationFrame(() => requestAnimationFrame(() => brand()));

    // Watch for theme toggles
    new MutationObserver(mutations => {
      for (const m of mutations) {
        if (m.attributeName === 'data-md-color-scheme') {
          brand(document.body.getAttribute('data-md-color-scheme'));
        }
      }
    }).observe(document.body, { attributes: true, attributeFilter: ['data-md-color-scheme'] });

    // Watch all .md-logo elements: on any child change, poll-cleanup for 2s
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

    // Observe existing logos + any future ones (body-level subtree observer)
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
