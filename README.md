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
- `src/components/PianoNav.jsx` — the drawn piano bar (every page): 曾 毅
  tiles, the third tile as the sound on/off switch (remembered per browser),
  and one octave C–C. Invisible hit areas sit over each drawn key; C, E, A and
  high C navigate (home, experience, about, create), the rest only play a note.
- `src/components/landing/` — the Home landing, built from Colin's drawing:
  sidebar, strings (a key click makes the character walk over and pluck its
  string, then navigates), the bridge in the fog, and the desk (the backpack
  unrolls a "what I have done" scroll; the monitor switches its screen on).
  Scrolling walks the character down to the desk (`src/hooks/useScrollProgress.js`).

## Updating the drawing

The landing and piano bar are Colin's Procreate drawing, exported as layers
(Share → PNG Files) on the 2732×2048 canvas, so every layer is already in
position.

1. Put the exported PNGs in `drawings/landing/`, named as in
   `scripts/layers.config.mjs` (e.g. `frame.png`, `header.png`, `dog.png`).
2. Run `npm run layers`. It trims each layer into `public/images/landing/` and
   writes where each one sits to `src/data/landingLayers.json`. Layers drawn
   as one (like the four strings) are split by the rectangles in the config.
3. The script lists drawings that aren't made yet (the framed sound tile,
   clouds, zzz); the site uses a fallback
   for each until they exist.

Words for the drawing (alt text, the bridge bubble, desk labels) live in
`landing` in `src/data/content.js`; measured spots in the drawing (key edges,
the pick, the desk panel) live in `src/data/landingGeometry.js`. The site
uses the drawing's palette (green page, light panels) in light and dark mode.
- `src/components/WorkCard.jsx` — the card layout, shared by experience and projects.
- `src/index.css` — every design token (colors, fonts) and component style, all in one file.

## Deploy

On Vercel, import this repo same as before, but this time the **Framework Preset**
will auto-detect as **Vite** (not "Other" like the static HTML version) — leave
the build command and output directory as their defaults (`npm run build`, `dist`).
