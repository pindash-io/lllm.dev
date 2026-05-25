(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function revealAll() {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
  }

  function harden() {
    const searchBtn = document.querySelector('.md-search__button[aria-label="Search"]');
    if (searchBtn && !searchBtn.hasAttribute('aria-label')) {
      searchBtn.setAttribute('aria-label', 'Open search');
    }
    const backToTop = document.querySelector('.md-top');
    if (backToTop && !backToTop.hasAttribute('aria-label')) {
      backToTop.setAttribute('aria-label', 'Back to top');
    }
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
    const scheme = theme || document.body.getAttribute('data-md-color-scheme');
    const isDark = scheme !== 'default';
    const gold = isDark ? '#E8B830' : '#C4961A';

    document.querySelectorAll('.md-logo').forEach(logo => {
      // Remove any stray lucide icons
      logo.querySelectorAll('svg:not([data-custom-logo])').forEach(s => s.remove());
      if (logo.querySelector('svg[data-custom-logo]')) return;

      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 32 32');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('width', '24');
      svg.setAttribute('height', '24');
      svg.setAttribute('data-custom-logo', '');

      const waves = [
        'M 3,8.5 C 4.5,6 6.5,5.5 8,7.5 C 9.5,9.5 11,10.5 13,8.5 C 15,6 17,5 19,7 C 21,9 23,10.5 25,8.5 C 26,7 27,7.5 27,8.5',
        'M 5,16 C 6.5,14 8,13.5 9.5,15.5 C 11,17.5 13,18.5 15,16 C 16.5,14 18,13 19.5,15.5 C 21,18 22.5,18.5 25,16',
        'M 3,23 C 4.5,21 6,20.5 7.5,22.5 C 9.5,24.5 11,25 13,22.5 C 14.5,20.5 16,20 18,22.5 C 19.5,24.5 21,25 24,23',
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
