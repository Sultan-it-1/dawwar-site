# Dawwar · دوّار — public site

The public pages for Dawwar, a file converter for Windows: the landing page (Arabic at `/`, English at `/en/`) and the
privacy policy that the Microsoft Store links to. GitHub Pages serves this repository (Settings → Pages → Deploy from
a branch: `main`, `/`).

The source is the main (private) Dawwar repository: `docs/PRIVACY.md` and `docs/site/`. Change things there first,
then copy here. `index.html`, `en/index.html` and `assets/` are built there with `node docs/site/_src/build.mjs`, so
they are not edited by hand in this repository.
