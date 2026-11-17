// The geometry of a turning page. A leaf is cut into thin vertical strips, each
// hinged to the one before it, so a little extra rotation per strip curves the
// paper instead of swinging it flat like a door. `p` is how far the turn has
// gone: 0 lying where it started, 1 landed on the other side of the spine.

export const STRIPS = 12
const BEND = 48 // degrees of curl across the whole leaf at the middle of a turn
const SHADE = 0.3 // how dark a strip gets as it turns edge-on to the light
const GLOSS = 0.16 // the sheen as a strip catches the light on its way over
const FLICK = 0.45 // px per ms toward or away from the spine that decides a release on its own
const MIN_SPAN = 1

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n))

// Each strip's angle from lying flat, in degrees. The free edge leads, with more
// of the curl near it, as when a page is lifted by its corner. `steps` are each
// strip's turn relative to the one before (the first is 0: it carries `base`).
export function leafAngles(p, n = STRIPS) {
  const t = clamp(p, 0, 1)
  const bend = BEND * Math.sin(Math.PI * t)
  const weights = Array.from({ length: n - 1 }, (_, i) => i + 1)
  const total = weights.reduce((sum, w) => sum + w, 0) || 1
  const steps = [0, ...weights.map((w) => (bend * w) / total)]
  const base = clamp(180 * t - bend / 2, 0, 180 - bend)
  let at = base
  const absolute = steps.map((step) => (at += step))
  return { base, steps, absolute }
}

// How a strip at `angle` degrees looks: the face toward the viewer darkens as
// it turns edge-on, and glints on the way through
export function stripLight(angle) {
  const a = (angle * Math.PI) / 180
  const glint = Math.max(0, Math.sin(2 * a)) * GLOSS
  return {
    front: (SHADE * (1 - Math.cos(a))) / 2,
    back: (SHADE * (1 + Math.cos(a))) / 2,
    glint,
  }
}

// Which page slice each strip's faces show, counted in strip widths from the
// page's left edge. A forward leaf is hinged on its left; a backward one on its right.
export function sliceFor(dir, i, n = STRIPS) {
  const mirrored = n - 1 - i
  return dir === 'next' ? { front: i, back: mirrored } : { front: mirrored, back: i }
}

// How far a drag has turned the leaf: the edge follows the pointer from where
// it was picked up to the far edge of the opposite page
export function dragProgress(dir, { x, x0, spine, pageWidth }) {
  if (dir === 'next') {
    const span = Math.max(MIN_SPAN, x0 - (spine - pageWidth))
    return clamp((x0 - x) / span, 0, 1)
  }
  const span = Math.max(MIN_SPAN, spine + pageWidth - x0)
  return clamp((x - x0) / span, 0, 1)
}

// Whether a released leaf goes over. A quick throw decides it whichever way it
// goes; otherwise it goes over once it's past halfway. `velocity` is px per ms
// across the screen (positive to the right).
export function shouldCommit(dir, p, velocity = 0) {
  const toward = dir === 'next' ? -velocity : velocity
  if (toward > FLICK) return true
  if (toward < -FLICK) return false
  return p > 0.5
}

// Which page sits where. Spread k has notes for piece k on the left and the
// piece itself on the right. While a leaf turns, the pages under it are the
// ones it uncovers on one side and will land on on the other.
export function spreadFor(index, turn) {
  if (!turn) return { left: index, right: index, leaf: null }
  if (turn.dir === 'next') return { left: index, right: index + 1, leaf: { front: index, back: index + 1 } }
  return { left: index - 1, right: index, leaf: { front: index, back: index - 1 } }
}

// A caption like 'painting — the title' as its kind and its title
export function splitCaption(caption = '') {
  const at = caption.indexOf(' — ')
  if (at < 0) return { kind: '', title: caption }
  return { kind: caption.slice(0, at), title: caption.slice(at + 3) }
}
