# AGENTS.md — Development Rules for lllm.dev

## 1. Project Overview

- **Stack**: Zensical (MkDocs fork) static site generator
- **Config**: `zensical.toml` (TOML syntax)
- **Content**: `docs/` — Markdown (`.md`) files
- **Output**: `site/` — generated HTML/CSS/JS
- **Live**: [lllm.dev](https://lllm.dev) | local: `http://localhost:8001`

## 2. Build & Serve

```bash
# Build only
zensical build

# Build + serve (preferred for development)
zensical serve
# Or on a custom port
zensical serve --dev-addr localhost:PORT
```

**Never** use `python3 -m http.server` or `npx serve` — always use `zensical serve`.

The `zensical serve` command also rebuilds, so `docs/` changes are automatically copied to `site/`.

## 3. CSS Rules

### File location
All custom CSS goes in **`docs/stylesheets/extra.css`**. It is loaded via:
```toml
extra_css = ["stylesheets/extra.css"]
```
`zensical build` copies it to `site/stylesheets/extra.css`.

### Specificity
MkDocs built-in styles use **`.md-typeset`** prefix with high-specificity selectors.
To override them, match or exceed that specificity:

```css
/* ❌ Too weak — gets overridden */
.md-button { ... }

/* ✅ Matches MkDocs specificity */
.md-typeset .md-button { ... }
.md-typeset .grid.cards > ul > li { ... }
```

### Theming
Use MkDocs CSS custom properties for color-safe light/dark mode:
- `var(--md-primary-fg-color)` — accent (indigo)
- `var(--md-primary-fg-color--light)` — lighter accent
- `var(--md-primary-fg-color--dark)` — darker accent
- `var(--md-primary-bg-color)` — text on accent (white)
- `var(--md-default-fg-color)` — main text
- `var(--md-default-fg-color--light)` — muted text
- `var(--md-default-fg-color--lightest)` — borders
- `var(--md-default-bg-color)` — page background
- `var(--md-default-bg-color--light)` — card/tile background

Palettes are defined per-scheme in `extra.css` under `[data-md-color-scheme="slate"]` and `[data-md-color-scheme="default"]`.

## 4. JavaScript Rules

### File location
All custom JS goes in **`docs/javascripts/extra.js`**.
Enable it in `zensical.toml`:
```toml
extra_javascript = ["javascripts/extra.js"]
```

### Browser compatibility
- Use vanilla JS (no frameworks)
- Provide fallbacks for missing APIs (IntersectionObserver, etc.)
- Respect `prefers-reduced-motion: reduce`

## 5. Design System

### Buttons
- `border-radius: 22px` (pill, not circle)
- `padding: 9px 20px`
- `inline-flex` with `gap: 8px` for icon+text
- **Invert on hover**: filled → outline, outline → filled
- `transition: background 0.3s, border-color 0.3s, color 0.3s`

### Tags / Pills
- `display: inline-flex`, `height: 24px`, `padding: 0 12px`
- `border-radius: 12px`, `border: 1px solid`
- `vertical-align: middle` when inline with text
- No `text-transform`, no uppercase

### Cards
- `border-radius: 12px`, `1px solid` border
- Light background tile with hover border darkening
- Title + description + link in **one** `<li>` (4-space indent in markdown)

### Reveal Animations
- `opacity 0 → 1`, `translateY(16px) → 0`, `0.7s ease`
- Stagger with `--reveal-delay` (0.08s per card)
- `IntersectionObserver` with `rootMargin: 0px 0px -12% 0px`
- Disable for `prefers-reduced-motion`

### Content Links
- Accent color (`var(--md-primary-fg-color)`)
- No underline by default → underline on hover
- `transition: border-color 0.25s ease, color 0.25s ease`

## 6. Markdown Rules

### Grid Cards
Use MkDocs grid card syntax with **4-space indentation** for continuation content:
```markdown
<div class="grid cards" markdown>

-   **Card Title**

    Description paragraph goes here (4 spaces indented).

    [Link text](url)

-   **Another Card**

    Its description.

    [Read more](url)

</div>
```

⚠️ 2-space indentation causes description and link to render as **separate DOM elements**, not part of the card.

## 7. Testing

After changes, verify via CDP eval:
```bash
cd web-browser-skill/scripts
node scripts/nav.js http://localhost:PORT
node scripts/eval.js 'JSON.stringify(/* query */)'
node scripts/screenshot.js --full-page
```

Check key CSS properties are applied:
- `borderRadius`, `padding`, `display`, `border` on buttons
- `borderRadius`, `marginBottom`, `verticalAlign` on tags
- `.reveal` class count and `.is-visible` count
- Dark mode: `document.documentElement.setAttribute("data-md-color-scheme","slate")`

## 8. Version Control

Use **[Jujutsu](https://jj-vcs.github.io/)** (`jj`) for all version control operations.

### Commit
```bash
jj commit -m "type(scope): summary"
```
Follow Conventional Commits: `feat`, `fix`, `docs`, `chore`, `refactor`.

### Push
```bash
jj git push
```

**Never** use raw `git commit` or `git push` — always use `jj`.

## 9. File Syncing

After editing source files, always run `zensical build` to sync `docs/` → `site/`.
Verify with:
```bash
diff docs/stylesheets/extra.css site/stylesheets/extra.css
```
