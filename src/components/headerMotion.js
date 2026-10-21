// Scroll maths for the piano header as Home moves on from the landing into
// the case studies: the header condenses (tiles away, a green band behind
// it) while Colin's name and tagline fly up from the sidebar into the
// tiles' corner, and the drawn underline slides from HOME toward EXPERIENCE.
// Pure functions, so they're testable without layout.

const clamp01 = (v) => Math.min(1, Math.max(0, v))
// gentle start and stop
const ease = (t) => t * t * (3 - 2 * t)

// How condensed the header is, 0 → 1. On wide screens it starts the moment
// the sidebar stops sticking under the piano (its top rising above pianoH),
// so the name takes off as the sidebar starts to leave; on phones (no sticky
// sidebar) it follows the case studies' top over the last `range` px before
// it reaches the header.
export function condenseProgress({ sideTop, caseTop, pianoH, range, phone = false }) {
  if (!(range > 0)) return 0
  const travelled = phone ? pianoH + range - caseTop : pianoH - sideTop
  return ease(clamp01(travelled / range))
}

// Transform taking an element at rest in `to` onto `from` (both
// { left, top, width } in viewport px), eased back to rest as t goes 0 → 1.
// Scale is uniform: both rects show the same drawing.
export function flight(from, to, t) {
  const k = 1 - clamp01(t)
  const s = to.width > 0 ? from.width / to.width : 1
  return {
    x: (from.left - to.left) * k,
    y: (from.top - to.top) * k,
    s: 1 + (s - 1) * k,
  }
}

// how far down the window, under the header, the case studies' top edge has
// to come up to before the underline moves on to EXPERIENCE
const CASES_IN_VIEW = 0.6

// Which label the underline sits under on Home: 0 (HOME) over the landing,
// 1 (EXPERIENCE) once the case studies fill a good part of the window. Never
// in between; CSS glides it across when it switches.
export function homeUnderlineStop({ caseTop, pianoH, viewportH }) {
  return caseTop <= pianoH + (viewportH - pianoH) * CASES_IN_VIEW ? 1 : 0
}

// Which labels the underline runs between: on Home from HOME toward
// EXPERIENCE (the case studies lead there); elsewhere it rests on the page's
// own label, which also covers the pages under it (/work/list, /work/<id>).
// A label's pages are under `owns` when it has one, else under `to`.
// Unknown routes leave it on HOME.
export function underlineSpan(pathname, labels) {
  if (pathname === '/') return { from: 'home', to: 'experience' }
  const owns = (l) => l.owns ?? l.to
  const own = labels.find((l) => owns(l) !== '/' && (pathname === owns(l) || pathname.startsWith(owns(l) + '/')))?.label ?? 'home'
  return { from: own, to: own }
}
