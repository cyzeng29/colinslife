# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, held equally:

- **Internship recruiters and hiring managers** (software, ML, data) who arrive from a resume, LinkedIn, or an application link. They skim quickly to see what Colin has built, whether the work is real, and how to get in touch.
- **Colin, the owner.** The site is also a personal creative space: a place to show music, drawing, sport, and making things, not only a resume in HTML.

## Product Purpose

A personal site for Colin Zeng, a Duke computer science and statistics student. It should leave visitors with a clear, memorable sense of who Colin is, technical and creative, and give them an easy path to contact him (email, LinkedIn, GitHub, resume). Success means both happen: a recruiter remembers the person and reaches out.

## Positioning

The site is itself evidence of the claim in the intro ("I like taking the things I imagine and making them real"). Its interactive details (a piano-key nav that plays notes, a dive intro, a penguin timeline, hand-drawn doodles) carry Colin's music, art, and making, so the site shows the creative side instead of only describing it.

## Operating Context

- Three routes: `/` (Home: intro, contact links, photo), `/work` (experience and project cards, penguin timeline, detail dialogs), `/about` (bio and an interests "desk").
- A recruiter usually lands on `/` or is deep-linked to `/work`. The intro video plays only on `/`, once per session, and never under reduced motion.
- All content lives in `src/data/content.js`. Colin adds entries and images there without editing JSX, and future work must keep that workflow.
- Deployed on Vercel as a Vite static build.

## Capabilities and Constraints

- React 18 + Vite + react-router-dom. All styles and tokens are in `src/index.css`.
- Work entries come from data. Adding an object creates a card, a timeline penguin, and a dialog. Empty optional fields (`context`, `outcomes`, `links`, images) must degrade gracefully.
- Empty image slots show sketch-style placeholders until real images are added to `public/images/`.
- The resume link appears only when `public/resume.pdf` exists at build time. Until then it shows "resume · soon".
- Open: the GitHub and LinkedIn links currently point to bare `https://github.com` / `https://linkedin.com` placeholders and need the real profile URLs.
- Open: the portrait (9:16) cut of the intro video doesn't exist yet. Both sources use `dive.mp4`.

## Brand Commitments

The following are binding and should be preserved by any future redesign or refinement:

- **Piano-key navigation with sound.** Pressing a nav key plays a note.
- **The dive intro video** (`public/dive.mp4`) as the opening overlay.
- **The penguin timeline and hand-drawn doodle personality.**
- **Lowercase, casual, first-person voice.** Plain words and lowercase labels ("email", "resume · soon", "view experience →"), with no corporate phrasing.
- Name: Colin Zeng. Contact email: colin.zeng@duke.edu.

## Evidence on Hand

- Experience: Dietrich Lab, Duke (Jan 2026–present, pondslime.ccn.duke.edu); Quantworks / SIZEO (Oct 2024–Aug 2025); NCSSM Summer Research (2023–2024). Details are in `src/data/content.js`.
- Projects: Speech Dysfluency Detection, Insight journal app, Ultimate Frisbee Play Classifier (85% precision / 87% recall; ResNet18 91.3%), Event Horizon UE5 game (kooling.itch.io).
- Interests: drawing, guitar & piano, pickleball, ultimate frisbee, content production.
- Media: `public/dive.mp4`. Not yet on hand: project images, portrait photos, the resume PDF, and sketchbook scans. Future work must not fabricate them or write placeholder claims such as outcomes, testimonials, or metrics that aren't in the data.

## Product Principles

1. **Show, don't list.** Creativity is shown through how the site behaves, not claimed in copy.
2. **The recruiter's path stays short.** Personality never blocks reaching the work or the contact links, and deep links to `/work` skip the intro.
3. **Content is data.** New work and images go in `content.js`, and the design must hold up whether a slot is filled or empty.
4. **Honest and specific.** Use real numbers and real links only, and leave missing things visibly "soon" rather than faking them.

## Accessibility & Inclusion

Respect `prefers-reduced-motion` everywhere (the intro is skipped, and animations have reduced variants). Decorative doodles stay `aria-hidden`. Sound from the piano nav must never be the only signal of navigation.
