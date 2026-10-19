import { useEffect } from 'react'

const clamp = (v) => Math.min(1, Math.max(0, v))
// how long after the last scroll event he keeps stepping
const STEP_LINGER_MS = 160

// Scroll position of the second screen: the element (a marker just inside the
// desk panel) lands under the sticky piano, so the panel's top edge sits just
// under the keys, behind their labels.
// It's the end of the walk down, and where the ↓ key takes you.
export function secondScreenTop(el) {
  const pianoH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--piano-h')) || 0
  return Math.max(0, el.getBoundingClientRect().top + window.scrollY - pianoH)
}

// Drives the walk from the strings down to the desk. Progress runs from 0 at
// the top of the page to 1 at the second screen (targetRef reaching the
// bottom of the sticky piano), and is mirrored into CSS variables on rootRef:
//   --p       overall progress (desk blur eases off as it grows)
//   --fog     fog opacity: thickens on the way down, parts on arrival
//   --walk    0→1 as the character leaves the strings
//   --arrive  0→1 as the character appears at the desk
// plus data-walking on rootRef while he's mid-way and the page is moving
// (drives the walk cycle, so he stands still when the scrolling stops).
// Under reduced motion it holds the arrived state: no blur, no walking.
export default function useScrollProgress(rootRef, targetRef) {
  useEffect(() => {
    const root = rootRef.current
    const target = targetRef.current
    if (!root || !target) return

    const set = (vars) => Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v.toFixed(3)))

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      set({ '--p': 1, '--fog': 0.5, '--walk': 0, '--arrive': 1 })
      return
    }

    let frame = 0
    let stepTimer = 0
    function update(fromScroll) {
      frame = 0
      const p = clamp(window.scrollY / Math.max(1, secondScreenTop(target)))
      const fog = p < 0.5 ? 0.7 + 0.3 * (p / 0.5) : 1 - (p - 0.5) / 0.5
      const walk = clamp(p / 0.85)
      set({ '--p': p, '--fog': fog, '--walk': walk, '--arrive': clamp((p - 0.75) / 0.25) })
      const midway = walk > 0 && walk < 1
      root.toggleAttribute('data-walking', midway && fromScroll)
      clearTimeout(stepTimer)
      if (midway && fromScroll) stepTimer = setTimeout(() => root.removeAttribute('data-walking'), STEP_LINGER_MS)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(() => update(true))
    }
    const onResize = () => {
      if (!frame) frame = requestAnimationFrame(() => update(false))
    }
    update(false)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(stepTimer)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [rootRef, targetRef])
}
