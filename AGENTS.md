# AI Agent Instructions for Moscovium/Cetsy Homepage

## Project overview
This repository is a static marketplace homepage for a site called "Cetsy." It is primarily HTML/CSS/JavaScript with no build system.

## Key files
- `index.html` — main homepage for GitHub Pages or static hosting
- `indx.html` — preserved original backup homepage
- `index.php` / `indx.php` — PHP variants, not usable on Netlify static hosting
- `css/extracted.css` — main stylesheet
- `js/currency.js`, `js/i18n.js`, `marketplace.js` — site behavior and internationalization
- `netlify.toml` — Netlify static deploy configuration
- `README.md` — repo usage and deployment notes
- `MARKETPLACE_GUIDE.md`, `DEPLOYMENT_STATUS.md`, `DNS_SETUP_GUIDE.md`, `GODADDY_SYNC_CONFIG.md` — additional deployment and marketplace docs

## Development guidance
- There is no package manager, build step, or test suite in this repository.
- To preview changes, open `index.html` or `indx.html` in a browser locally.
- For deployment, use the repo root as the publish directory on Netlify or GitHub Pages.
- Keep external CSS/JS references intact unless the user explicitly asks to change them.
- Do not assume server-side PHP execution is available on static hosting.

## When the user asks about uploading or deploying
- Recommend committing the static files to GitHub.
- Use `index.html` at repository root for GitHub Pages or Netlify static publishing.
- Note: `index.php` / `indx.php` are not supported by Netlify static deploys.

## What to avoid
- Do not add a build process or package management unless the user asks for one and it is appropriate.
- Do not remove or rename the existing homepage files unless explicitly requested.
