# colin-zeng-site

React + Vite version of the portfolio, with real routes (`/`, `/work`, `/about`)
instead of show/hide divs.

## Run it locally

```bash
npm install
npm run dev
```

Opens at http://localhost:5173

Tests (Vitest + Testing Library, in `src/**/__tests__/`):

```bash
npm test
```

## Where things live

- `src/data/content.js` — every work/project card, the Home intro, the About bio,
  the desk interests, and every image slot. Add an object to either array and a
  new card (and timeline penguin) appears on the Work page automatically.
- Images: put files in `public/images/` and set `src: 'images/name.jpg'` on any
  slot in `content.js`. Empty slots show a sketch-style placeholder.
- About desk drawings: originals live in `drawings/`; web copies (transparent,
  1400px wide) live in `public/images/desk/`. The table and penguins must share
  one canvas size and crop so each penguin lands on the tabletop.
- Resume: add `public/Colin_Zeng_Resume.pdf`. The `resume ↗` link appears on the next build
  (restart `npm run dev` after adding it); until then it shows "resume · soon".
- `src/pages/` — one file per page (Home, Work, About).
- `src/components/PianoNav.jsx` — the piano key nav bar and its press animation.
- `src/components/WorkCard.jsx` — the card layout, shared by experience and projects.
- `src/index.css` — every design token (colors, fonts) and component style, all in one file.

## Deploy

On Vercel, import this repo same as before, but this time the **Framework Preset**
will auto-detect as **Vite** (not "Other" like the static HTML version) — leave
the build command and output directory as their defaults (`npm run build`, `dist`).
