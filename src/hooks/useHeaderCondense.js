import { useEffect, useState } from 'react'
import { condenseProgress, flight, homeUnderlineStop } from '../components/headerMotion.js'

// how far (as a share of the window's height) the sidebar scrolls away while
// the name flies up and the header condenses
const RANGE = 0.45

// Condenses the piano header (wrapRef) as Home moves on from the landing into
// the case studies; every other page keeps it condensed. Mirrors into CSS on
// wrapRef:
//   --condense  0 → 1: tiles fade away, the green band fades in behind
//   --nav-u     0 or 1: the underline under HOME or EXPERIENCE (Home)
//   data-name   while the header's copy of the name shows
// and each [data-fly] element inside it (the header's name and tagline) is
// moved onto the matching drawing in the sidebar, easing back to rest in the
// corner as --condense grows: it takes off from exactly where the sidebar's
// own copy is (measured live, at any window size), which hides meanwhile
// (data-flying on <html>). Phones have no room for the name, and reduced
// motion swaps it in place without the flight.
// Returns whether the header counts as condensed, for focus and screen
// readers (only one set of tiles / name is exposed at a time).
export default function useHeaderCondense(wrapRef, { home, phone }) {
  const [condensed, setCondensed] = useState(!home)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const html = document.documentElement
    const flyers = [...wrap.querySelectorAll('[data-fly]')]
    const rest = () => flyers.forEach((el) => el.style.removeProperty('transform'))
    const show = (t, u, nameShown) => {
      wrap.style.setProperty('--condense', t.toFixed(3))
      wrap.style.setProperty('--nav-u', u.toFixed(3))
      wrap.toggleAttribute('data-name', nameShown && !phone)
      setCondensed(t >= 0.5)
    }

    if (!home) {
      rest()
      show(1, 0, true)
      return
    }

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    function update() {
      frame = 0
      const pianoH = wrap.getBoundingClientRect().height
      const side = document.querySelector('.landing-side')
      const cases = document.querySelector('.case-studies')
      const caseTop = cases ? cases.getBoundingClientRect().top : Infinity
      let t = condenseProgress({
        sideTop: side ? side.getBoundingClientRect().top : pianoH,
        caseTop,
        pianoH,
        range: window.innerHeight * RANGE,
        phone,
      })
      if (reduce) t = t >= 0.5 ? 1 : 0
      const u = cases ? homeUnderlineStop({ caseTop, pianoH, viewportH: window.innerHeight }) : 0

      const flying = !phone && !reduce && t > 0
      html.toggleAttribute('data-flying', flying)
      flyers.forEach((el) => {
        const from = flying && t < 1 && side?.querySelector(`.${el.dataset.fly} .layer-img`)
        if (!from) return el.style.removeProperty('transform')
        const { x, y, s } = flight(from.getBoundingClientRect(), el.parentElement.getBoundingClientRect(), t)
        el.style.transform = `translate(${x}px, ${y}px) scale(${s})`
      })
      show(t, u, reduce ? t === 1 : t > 0)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      html.removeAttribute('data-flying')
      rest()
    }
  }, [wrapRef, home, phone])

  return condensed
}
