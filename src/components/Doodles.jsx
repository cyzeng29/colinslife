// Small hand-drawn line art. Everything strokes with currentColor so it
// follows the theme. Paths with className="draw" ink themselves in once
// (see .draw in index.css); they need pathLength="1" for that to work.

export function FrameHint({ kind }) {
  return (
    <svg className="frame-hint" viewBox="0 0 32 24" width="32" height="24">
      {kind === 'photo' && (
        <>
          <path d="M3 20 L11 11 L16 16 L21 10 L29 20" />
          <path d="M24 5.5 c0 -2 3 -2 3 0 c0 2 -3 2 -3 0" />
        </>
      )}
      {kind === 'screenshot' && (
        <>
          <path d="M9 6 L4 12 L9 18" />
          <path d="M23 6 L28 12 L23 18" />
          <path d="M18 4 L14 20" />
        </>
      )}
      {kind === 'drawing' && <path d="M3 17 C7 7 10 7 12 13 S17 21 20 12 S26 5 29 9" />}
    </svg>
  )
}

// Abstract sketch marks around the Home photo: a loose scribble ring,
// hatching, an annotation arrow and a small spark. No hobby imagery.
export function HomeAccents() {
  // viewBox is sized so the photo frame sits at (40,40)-(380,465)
  return (
    <svg className="home-accents" viewBox="0 0 420 505" aria-hidden="true">
      <path
        className="draw"
        pathLength="1"
        d="M70 20 C30 12 8 48 18 78 C28 104 70 104 82 76 C92 52 76 26 50 28 C38 29 28 36 24 44"
      />
      <path className="draw d2" pathLength="1" d="M14 478 L30 460 M20 490 L42 468 M28 498 L52 474 M40 503 L60 483" />
      <path className="draw d3" pathLength="1" d="M344 492 C360 492 370 484 374 470 M367 476 L374 469 L379 477" />
      <path className="draw d3" pathLength="1" d="M400 6 V34 M386 20 H414 M390 10 L410 30 M410 10 L390 30" />
    </svg>
  )
}

// Timeline marker. Facing right; the raised flipper and filled back only
// show on the current entry (styled in index.css).
export function Penguin() {
  return (
    <svg className="penguin" viewBox="0 0 22 26" width="22" height="26" aria-hidden="true">
      <path
        className="pg-body"
        d="M11 2.2 C6 2.2 3.8 7.2 4.2 13 C4.6 19.2 7.2 22.4 11 22.4 C14.8 22.4 17.4 19.2 17.8 13 C18.2 7.2 16 2.2 11 2.2 Z"
      />
      <path
        className="pg-belly"
        d="M11.6 7.4 C8.6 8.2 7.4 11.6 7.7 15 C8 18.4 9.4 20.4 11.2 20.4 C13 20.4 14.6 18.6 14.9 15.4 C15.2 11.6 14.2 8.4 11.6 7.4 Z"
      />
      <circle className="pg-eye" cx="13" cy="6" r="0.9" />
      <path className="pg-beak" d="M15.6 6.4 L18.8 7.3 L15.7 8.3" />
      <path className="pg-flip-down" d="M4.6 10.5 C3 12.4 2.5 14.8 3 16.8" />
      <path className="pg-flip-up" d="M4.6 10.5 C2.8 9.4 1.8 7.6 1.6 5.6" />
      <path className="pg-feet" d="M7.6 22.6 L9.8 22.9 M12.4 22.9 L14.6 22.6" />
    </svg>
  )
}
