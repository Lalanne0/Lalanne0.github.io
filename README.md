# Lalanne0.github.io

Personal website of Vincent Lalanne, served by GitHub Pages. Plain HTML, CSS and JavaScript: no build step.

```
index.html          redirects to en/ (or fr/ for French browsers)
en/, fr/            index, aboutme and projects pages, one copy per language
static/
  css/              styles_common.css (header, nav, animations) + one stylesheet per page
  js/main.js        navigation, scroll reveal, parallax, about-page layout
  fonts/            GT Walsheim Pro webfonts
  images/, cv/      assets
```

Each page sets `<body data-page="index|aboutme|projects">`, which `main.js` uses to pick the active tab and the language-switch target. Elements with `.js-hidden` fade in when scrolled into view; add `data-delay="ms"` to fix their delay.

Preview locally with any static server, for example `python3 -m http.server`, then open <http://localhost:8000>.

Pushing to `main` deploys through `.github/workflows/static.yml`.
