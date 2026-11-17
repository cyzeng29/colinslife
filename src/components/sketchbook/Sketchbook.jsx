import { useEffect, useRef, useState } from 'react'
import { asset } from '../Frame.jsx'
import { useLightbox } from '../Lightbox.jsx'
import useMediaQuery from '../../hooks/useMediaQuery.js'
import Leaf from './Leaf.jsx'
import { ArtPage, NotePage } from './Pages.jsx'
import { dragProgress, shouldCommit, spreadFor, splitCaption } from './leaf.js'
import usePageTurn from './usePageTurn.js'

const PICK_UP = 6 // px a pointer moves before it has picked the page up, rather than clicked
const LEAN = { x: 5, y: 7 } // most the book tilts toward the pointer, in degrees
const TEXTURES = {
  '--sb-wash': `url(${asset('images/sketchbook/wash.svg')})`,
  '--sb-grain': `url(${asset('images/sketchbook/paper.svg')})`,
}

// An open sketchbook for the About desk: one spread per piece, its notes on the
// left and the piece on the right. Drag a page to turn it, throw it, or click
// a page, use the arrow keys or the buttons. The turning leaf bends as paper
// does (Leaf.jsx); the book leans a little toward the pointer.
export default function Sketchbook({ pages }) {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const { index, turn, flip, grab, drag, release } = usePageTurn(pages.length, reduced)
  const [broken, setBroken] = useState({})
  const bookRef = useRef(null)
  const tiltRef = useRef(null)
  const gesture = useRef(null)
  const openLightbox = useLightbox()
  const total = pages.length
  const last = total - 1

  // Warm the cache so the page under a turning leaf is already there
  useEffect(() => {
    pages.flatMap((p) => p.items ?? [p]).forEach((p) => {
      if (p.src) new Image().src = asset(p.src)
    })
  }, [pages])

  const markBroken = (i) => () => setBroken((b) => ({ ...b, [i]: true }))
  const note = (i) => <NotePage page={pages[i]} number={i + 1} total={total} />
  const art = (i, decorative = false) => <ArtPage page={pages[i]} broken={broken[i]} onBroken={markBroken(i)} decorative={decorative} />

  function geometry() {
    const rect = bookRef.current.getBoundingClientRect()
    return { spine: rect.left + rect.width / 2, pageWidth: rect.width / 2 }
  }

  function onPointerDown(e) {
    if (e.button > 0) return
    const { spine } = geometry()
    gesture.current = { id: e.pointerId, x0: e.clientX, y0: e.clientY, dir: e.clientX >= spine ? 'next' : 'prev', held: false, last: { x: e.clientX, t: performance.now() }, v: 0 }
  }

  function onPointerMove(e) {
    const g = gesture.current
    if (g && g.id === e.pointerId) {
      const dx = e.clientX - g.x0
      if (!g.held && Math.abs(dx) > PICK_UP && Math.abs(dx) > Math.abs(e.clientY - g.y0)) {
        // a page only turns toward the spine: right page leftwards, left page rightwards
        const towardSpine = g.dir === 'next' ? dx < 0 : dx > 0
        g.held = towardSpine && grab(g.dir)
        if (g.held) e.currentTarget.setPointerCapture?.(e.pointerId)
        else gesture.current = null
      }
      if (g.held) {
        const now = performance.now()
        g.v = (e.clientX - g.last.x) / Math.max(1, now - g.last.t)
        g.last = { x: e.clientX, t: now }
        drag(dragProgress(g.dir, { x: e.clientX, x0: g.x0, ...geometry() }))
        return
      }
    }
    lean(e)
  }

  function onPointerUp(e) {
    const g = gesture.current
    gesture.current = null
    if (!g || g.id !== e.pointerId) return
    if (g.held) {
      const p = dragProgress(g.dir, { x: e.clientX, x0: g.x0, ...geometry() })
      release(shouldCommit(g.dir, p, g.v))
    } else if (Math.hypot(e.clientX - g.x0, e.clientY - g.y0) <= PICK_UP) {
      flip(g.dir)
    }
  }

  function onPointerCancel() {
    if (gesture.current?.held) release(false)
    gesture.current = null
  }

  // The book tips toward the pointer, a little
  function lean(e) {
    const tilt = tiltRef.current
    if (!tilt || reduced || !finePointer || (e.pointerType && e.pointerType !== 'mouse')) return
    const rect = tilt.getBoundingClientRect()
    const nx = (e.clientX - rect.left) / rect.width - 0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5
    tilt.style.setProperty('--sb-ry', `${(nx * LEAN.y * 2).toFixed(2)}deg`)
    tilt.style.setProperty('--sb-rx', `${(-ny * LEAN.x * 2).toFixed(2)}deg`)
  }

  function stand() {
    tiltRef.current?.style.setProperty('--sb-ry', '0deg')
    tiltRef.current?.style.setProperty('--sb-rx', '0deg')
  }

  function onKeyDown(e) {
    if (e.key === 'ArrowRight') flip('next')
    else if (e.key === 'ArrowLeft') flip('prev')
    else return
    e.preventDefault()
  }

  const spread = spreadFor(index, turn)
  const page = pages[index]
  const canEnlarge = openLightbox && page.src && !page.items && !broken[index] && !turn

  // Clicking the page turns it, so enlarging gets its own button
  function enlarge() {
    if (!canEnlarge) return
    const from = bookRef.current.querySelector('.sb-side.is-right img')
    openLightbox({ src: asset(page.src), alt: page.alt, caption: page.caption, from })
  }

  // The shadow a lifted leaf throws across the pages beside the spine
  const lifted = turn ? Math.sin(Math.PI * turn.p) : 0
  const { title } = splitCaption(page.caption)

  return (
    <div className="sketchbook" onPointerLeave={stand} style={TEXTURES}>
      <div ref={tiltRef} className="sb-tilt">
        <span className="sb-pool" aria-hidden="true" style={{ opacity: 1 - lifted * 0.35 }} />
        <div
          ref={bookRef}
          className={'sb-book' + (turn?.held ? ' is-held' : '')}
          role="group"
          aria-roledescription="sketchbook"
          aria-label={`Sketchbook, page ${index + 1} of ${total}${title ? `: ${title}` : ''}. Use the arrow keys to turn.`}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          style={{ '--sb-lifted': lifted.toFixed(3), '--sb-before': Math.min(index, 4), '--sb-after': Math.min(last - index, 4) }}
        >
          <div className="sb-side is-left" data-testid="sb-left">
            {spread.left >= 0 && note(spread.left)}
            <span className="sb-gutter" aria-hidden="true" />
          </div>
          <div className="sb-side is-right" data-testid="sb-right">
            {spread.right <= last && art(spread.right)}
            <span className="sb-gutter" aria-hidden="true" />
          </div>
          {spread.leaf && (
            <Leaf
              dir={turn.dir}
              p={turn.p}
              front={turn.dir === 'next' ? art(spread.leaf.front, true) : note(spread.leaf.front)}
              back={turn.dir === 'next' ? note(spread.leaf.back) : art(spread.leaf.back, true)}
            />
          )}
        </div>
      </div>

      {/* aria-disabled, not disabled: a focused button at the last page keeps focus */}
      <div className="sb-controls mono">
        <button type="button" onClick={() => flip('prev')} aria-disabled={index === 0}>
          <span aria-hidden="true">‹</span> prev<span className="sr-only"> page</span>
        </button>
        <span className="sb-count" aria-hidden="true">
          {index + 1} / {total}
        </span>
        <button type="button" onClick={() => flip('next')} aria-disabled={index === last}>
          next<span className="sr-only"> page</span> <span aria-hidden="true">›</span>
        </button>
        {canEnlarge && (
          <button type="button" className="sb-enlarge" onClick={enlarge}>
            enlarge<span className="sr-only"> page</span> <span aria-hidden="true">⤢</span>
          </button>
        )}
      </div>
      <p className="sb-hint mono" aria-hidden="true">
        drag a page to turn it
      </p>
      <p className="sr-only" aria-live="polite">
        {page.caption}
      </p>
    </div>
  )
}
