# AGENTS.md — lllm.dev

## Stack

- **Generator**: Zensical (MkDocs fork) — `zensical.toml` for config
- **Content**: `docs/*.md` → **Output**: `site/`
- **Live**: [lllm.dev](https://lllm.dev) | `localhost:8001`

## Commands

```bash
zensical build          # sync docs/ → site/
zensical serve          # build + dev server (preferred)
```

After editing files, always run `zensical build`. Never use `python3 -m http.server` or `npx serve`.

## Browser Debugging

Use the **web-browser** skill to inspect the site. Never `pkill -9 chrome` — it kills all tabs and user sessions. If Chrome is unresponsive, start a **new profile** instead:

```bash
cd web-browser-skill/scripts
node scripts/start.js              # fresh profile on :9222
# or
node scripts/start.js --profile   # copy your profile into isolated cache
```

## Files

| What | Where |
|------|-------|
| Custom CSS | `docs/stylesheets/extra.css` |
| Custom JS | `docs/javascripts/extra.js` |
| Config | `zensical.toml` |

## CSS

- **Override MkDocs styles** with `.md-typeset` prefix: `.md-typeset .md-button`, `.md-typeset .grid.cards > ul > li`
- **Use MkDocs CSS variables** for light/dark mode: `--md-primary-fg-color`, `--md-default-bg-color`, `--md-default-fg-color--light`, etc. (see palette blocks in `extra.css`)
- **Reveal animations** use transitions.dev panel-reveal (see `extra.css` `:root` vars)

## Markdown

Grid cards need **4-space indentation** for continuation content (title, description, link in one `<li>`):

```markdown
<div class="grid cards" markdown>

-   **Card Title**

    Description (4 spaces).

    [Link](url)

</div>
```

⚠️ 2 spaces breaks card layout.

## Version Control

Use **Jujutsu** (`jj`), not raw `git`:

```bash
jj commit -m "type(scope): summary"   # feat, fix, docs, chore, refactor
jj git push
```
