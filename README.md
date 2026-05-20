# Cetsy Homepage

This repository contains the Cetsy marketplace homepage HTML file.

## Files

- `index.html` — main homepage ready for GitHub Pages or repo upload
- `indx.html` — restored original file name preserved
- `original_homepage.html` — downloaded backup copy of the original source

## Upload instructions

1. Commit the files to your GitHub repository.
2. If you want GitHub Pages to serve the homepage, use `index.html` at the repository root.
3. Open the file in a browser locally to verify the page: `index.html`.

## Notes

- The page keeps external CSS and JavaScript references exactly as in the original source.
- No additional build process is required.

## Deploying to Netlify

This repository is a static site, so Netlify can deploy it from the repository root.

1. Create a new site in Netlify and connect it to `https://github.com/dmxmusicrecords-alt/moscovium.git`.
2. In Netlify, set the build directory to the repository root. The included `netlify.toml` already uses `publish = "."`.
3. To add secure environment variables, go to your Netlify site dashboard:
   - Site settings → Build & deploy → Environment → Environment variables
4. Add your key names there, for example:
   - `API_KEY`
   - `API_SECRET`
5. Use `.env.example` as a template for local development and do not commit `.env`.

> Note: Netlify supports static HTML/CSS/JS. The `index.php` and `indx.php` files will not run on Netlify because it does not execute PHP server-side. Use the static `index.html` and `indx.html` files for deployment.
