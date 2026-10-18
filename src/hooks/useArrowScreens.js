import { useEffect } from 'react'
import { secondScreenTop } from './useScrollProgress.js'

// slow enough to watch him walk between the screens
const WALK_MS = 1100
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

// ↓ on the first screen walks Colin down to the desk screen; ↑ from anywhere
// up to the desk walks him back to the strings. Further down the page the
// arrows scroll normally. Ignored while typing, with modifier keys, or while
// a dialog is open. The visitor scrolling or pressing another key mid-way
// takes over immediately.
export default function useArrowScreens(screenRef) {
  useEffect(() => {
    // scroll snapping would yank each animation step to a snap point
    const html = document.documentElement
    const pauseSnap = () => html.style.setProperty('scroll-snap-type', 'none')
    const resumeSnap = () => html.style.removeProperty('scroll-snap-type')

    let frame = 0
    const stop = () => {
      if (!frame) return
      cancelAnimationFrame(frame)
      frame = 0
      resumeSnap()
    }

    function walkTo(to) {
      stop()
      if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
        window.scrollTo({ top: to, behavior: 'auto' })
        return
      }
      pauseSnap()
      const from = window.scrollY
      let start = null
      const step = (now) => {
        if (start === null) start = now
        const t = Math.min(1, (now - start) / WALK_MS)
        window.scrollTo({ top: from + (to - from) * ease(t), behavior: 'auto' })
        frame = t < 1 ? requestAnimationFrame(step) : 0
        if (!frame) resumeSnap()
      }
      frame = requestAnimationFrame(step)
    }

    function onKey(e) {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return stop()
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return
      if (e.target?.closest?.('input, textarea, select, [contenteditable="true"]')) return
      if (document.querySelector('dialog[open]') || !screenRef.current) return

      const desk = secondScreenTop(screenRef.current)
      const y = window.scrollY
      const to = e.key === 'ArrowDown' ? (y < desk - 4 ? desk : null) : y > 4 && y <= desk + 4 ? 0 : null
      if (to === null) return
      e.preventDefault()
      walkTo(to)
    }

    window.addEventListener('keydown', onKey)
    window.addEventListener('wheel', stop, { passive: true })
    window.addEventListener('touchstart', stop, { passive: true })
    return () => {
      stop()
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('wheel', stop)
      window.removeEventListener('touchstart', stop)
    }
  }, [screenRef])
}
