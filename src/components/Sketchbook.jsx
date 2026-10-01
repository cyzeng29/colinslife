import { useEffect, useRef, useState } from 'react'
import { asset } from './Frame.jsx'
import { FrameHint } from './Doodles.jsx'

const SWIPE = 30 // px of horizontal drag that counts as a flip rather than a click

const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// A spiral-bound sketchbook for the About desk. Click the right/left half of
// the page, drag across it, use the arrow keys or the buttons to flip; the
// leaf turns around the spine (styled in index.css).
export default function Sketchbook({ pages }) {
  const [index, setIndex] = useState(0)
  const [turn, setTurn] = useState(null) // { dir: 'next' | 'prev', to }
  const [broken, setBroken] = useState({})
  const startX = useRef(null)
  const last = pages.length - 1

  // Warm the cache so the page underneath a turning leaf is already there.
  useEffect(() => {
    pages.forEach((p) => {
      if (p.src) new Image().src = asset(p.src)
    })
  }, [pages])

  function flip(dir) {
    if (turn) return
    const to = dir === 'next' ? index + 1 : index - 1
    if (to < 0 || to > last) return
    if (prefersReducedMotion()) setIndex(to)
    else setTurn({ dir, to })
  }

  function finishTurn() {
    setIndex(turn.to)
    setTurn(null)
  }

  function onPointerDown(e) {
    startX.current = e.clientX
  }

  function onPointerUp(e) {
    if (startX.current === null) return
    const dx = e.clientX - startX.current
    startX.current = null
    if (Math.abs(dx) > SWIPE) return flip(dx < 0 ? 'next' : 'prev')
    const rect = e.currentTarget.getBoundingClientRect()
    flip(e.clientX - rect.left > rect.width / 2 ? 'next' : 'prev')
  }

  function onKeyDown(e) {
    if (e.key === 'ArrowRight') flip('next')
    else if (e.key === 'ArrowLeft') flip('prev')
    else return
    e.preventDefault()
  }

  // While turning forward the current page lifts off the next one; turning
  // back, the previous page falls onto the current one.
  const under = turn?.dir === 'next' ? turn.to : index
  const leaf = turn ? (turn.dir === 'next' ? index : turn.to) : null
  const shown = turn ? turn.to : index

  const renderPage = (i) => {
    const page = pages[i]
    const ok = page.src && !broken[i]
    return (
      <div className={`sb-page is-${page.kind || 'drawing'}`}>
        {ok ? (
          <img
            src={asset(page.src)}
            alt={page.alt}
            draggable="false"
            onError={() => setBroken((b) => ({ ...b, [i]: true }))}
          />
        ) : (
          <div className="frame-empty" aria-hidden="true">
            <FrameHint kind="drawing" />
            <span className="mono">{page.placeholder || 'page'}</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="sketchbook">
      <div
        className="sb-book"
        role="group"
        aria-roledescription="sketchbook"
        aria-label={`Sketchbook, page ${shown + 1} of ${pages.length}. Use the arrow keys to flip.`}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (startX.current = null)}
      >
        <span className="sb-spiral" aria-hidden="true" />
        <div className="sb-stack">
          {index < last && <span className="sb-edge" aria-hidden="true" />}
          {renderPage(under)}
          {leaf !== null && (
            <div className={`sb-leaf is-${turn.dir}`} aria-hidden="true" onAnimationEnd={finishTurn}>
              <div className="sb-face">{renderPage(leaf)}</div>
              <div className="sb-face sb-back" />
            </div>
          )}
        </div>
      </div>

      {/* aria-disabled, not disabled: a focused button at the last page keeps focus */}
      <div className="sb-controls mono">
        <button type="button" onClick={() => flip('prev')} aria-disabled={shown === 0}>
          <span aria-hidden="true">‹</span> prev<span className="sr-only"> page</span>
        </button>
        <span className="sb-count" aria-hidden="true">
          {shown + 1} / {pages.length}
        </span>
        <button type="button" onClick={() => flip('next')} aria-disabled={shown === last}>
          next<span className="sr-only"> page</span> <span aria-hidden="true">›</span>
        </button>
      </div>
      <p className="sb-caption mono" aria-live="polite">
        {pages[shown].caption}
      </p>
    </div>
  )
}
