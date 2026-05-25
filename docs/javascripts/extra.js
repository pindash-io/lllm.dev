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

  function setup() {
    harden();

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
