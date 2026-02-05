# Turaan Browser

Turaan Browser is a lightweight, Chrome-style browser mockup with a dedicated Turaan Search experience powered by Google Search.
External sites are previewed inside Turaan View, and you can copy links from the preview bar if needed.

## Run locally

Open `index.html` directly in your browser, or serve the folder with a simple static server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploy on GitHub Pages

1. Push this repository to GitHub.
2. In **Settings → Pages**, set **Source** to `Deploy from a branch` and pick your default branch with `/ (root)`.
   - If you already set GitHub Pages to `/docs`, keep it there—this repo mirrors the site in `docs/` too.
3. Save, then open the URL GitHub Pages provides.

GitHub Pages serves the static files directly, so no build step is required.
