import { useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { isMuted, playNote, setMuted } from '../audio/notes.js'
import { usePluck } from './PluckProvider.jsx'
import CanvasRegion, { Layer, LayerImg, Spot, place, useRegion } from './landing/CanvasRegion.jsx'
import useMediaQuery from '../hooks/useMediaQuery.js'
import useHeaderCondense from '../hooks/useHeaderCondense.js'
import { underlineSpan } from './headerMotion.js'
import { LAYERS, PIANO, hasLayer, stageRegions } from '../data/landingGeometry.js'

// One real octave, C4 to C5, matching the drawn keys. Keys with `to` navigate
// (each carries a drawn label and hangs a string on the Home landing); the
// rest only play their note. EXPERIENCE goes to the case studies on Home, and
// counts as current on the pages under `owns` (the case studies, the list).
export const octave = [
  { note: 'C', freq: 261.63, to: '/', label: 'home' },
  { note: 'D', freq: 293.66 },
  { note: 'E', freq: 329.63, to: '/#case-studies', owns: '/work', label: 'experience' },
  { note: 'F', freq: 349.23 },
  { note: 'G', freq: 392.0 },
  { note: 'A', freq: 440.0, to: '/about', label: 'about' },
  { note: 'B', freq: 493.88 },
  { note: 'C', freq: 523.25, to: '/create', label: 'create' },
]


// The condensed header's corner (canvas px, where the tiles were): Colin's
// name over his tagline, as drawn in the sidebar. Boxes keep each drawing's
// own proportions.
const CORNER = {
  link: { x: 96, y: 34, w: 400, h: 390 },
  name: { x: 96, y: 34, w: 400, h: 270 },
  tagline: { x: 104, y: 318, w: 240, h: 106 },
}

// The drawn underline: a little wider than a label, just under it
function underlineBox(label) {
  const b = LAYERS[`label-${label}`]
  const w = b.w * 1.2
  return { x: b.x + (b.w - w) / 2, y: 452, w, h: 18 }
}

// Plain clicks only: cmd/ctrl/shift-click should still open a new tab.
const isPlainClick = (e) => e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey

// Hit area for white key i: its column of the drawing, with the corners the
// black keys cover cut away so a click lands on the key you see.
function keyShape(i) {
  const { edges, black, top, bottom, blackBottom } = PIANO
  const left = edges[i]
  const right = edges[i + 1]
  const w = right - left
  const notch = (edge) => black.find(([a, b]) => a < edge && edge < b)
  const l = notch(left) ? ((notch(left)[1] - left) / w) * 100 : 0
  const r = notch(right) ? ((right - notch(right)[0]) / w) * 100 : 0
  const h = ((blackBottom - top) / (bottom - top)) * 100
  return {
    box: { x: left, y: top, w, h: bottom - top },
    clipPath: `polygon(${l}% 0, ${100 - r}% 0, ${100 - r}% ${h}%, 100% ${h}%, 100% 100%, 0 100%, 0 ${h}%, ${l}% ${h}%)`,
  }
}

function Keys({ current, pressed, onNav }) {
  const region = useRegion()
  return octave.map((k, i) => {
    const { box, clipPath } = keyShape(i)
    const style = { ...place(box, region), clipPath }
    return k.to ? (
      <Link
        key={k.to}
        to={k.to}
        data-string={k.to}
        style={style}
        onClick={(e) => onNav(e, k)}
        onPointerEnter={(e) => e.pointerType === 'mouse' && playNote(k.freq)}
        onPointerDown={(e) => e.pointerType !== 'mouse' && playNote(k.freq)}
        aria-current={current === k.label ? 'page' : undefined}
        className={'key playable' + (current === k.label ? ' active' : '') + (pressed === k.label ? ' pressed' : '')}
      >
        <span className="sr-only">{k.label}</span>
      </Link>
    ) : (
      // Toy keys: mouse-only extras, kept out of the tab order
      <button
        key={`${k.note}-${i}`}
        type="button"
        className="key note"
        style={style}
        tabIndex={-1}
        aria-hidden="true"
        onPointerDown={() => playNote(k.freq)}
      />
    )
  })
}

export default function PianoNav() {
  const [pressed, setPressed] = useState(null)
  const [muted, setMutedState] = useState(isMuted)
  const pluck = usePluck()
  const phone = useMediaQuery('(max-width: 700px)')
  const bar = stageRegions(phone).bar
  const { pathname } = useLocation()
  const wrapRef = useRef(null)
  const condensed = useHeaderCondense(wrapRef, { home: pathname === '/', phone })
  // phones keep the tiles (there's no room for the name in the bar)
  const tucked = condensed && !phone
  const navKeys = octave.filter((k) => k.to)
  const span = underlineSpan(pathname, navKeys)
  const from = place(underlineBox(span.from), bar)
  const to = place(underlineBox(span.to), bar)

  function handleNav(e, k) {
    setPressed(k.label)
    setTimeout(() => setPressed(null), 140)
    if (isPlainClick(e) && pluck?.pluck(k)) e.preventDefault()
  }

  function toggleSound() {
    setMuted(!muted)
    setMutedState(!muted)
  }

  // the framed White Dragon tile once drawn; the blank tile until then
  const soundTile = muted && hasLayer('tile-dragon-muted') ? 'tile-dragon-muted' : hasLayer('tile-dragon') ? 'tile-dragon' : 'tile-blank'

  return (
    <div className="piano-wrap" ref={wrapRef} data-phone={phone || undefined}>
      <CanvasRegion region={bar} className="piano-region">
        {/* just the drawn header (tiles, keys, labels): no backdrop until it
            condenses, so the landing shows through around it */}
        <div className="header-tiles" aria-hidden={tucked || undefined}>
          <Layer slug="tile-zeng" />
          <Layer slug="tile-yi" />
          <Spot
            as="button"
            type="button"
            box={LAYERS['tile-blank']}
            className={'tile-sound' + (muted && soundTile !== 'tile-dragon-muted' ? ' is-muted-fallback' : '')}
            aria-pressed={!muted}
            aria-label="piano sound"
            title={muted ? 'sound off' : 'sound on'}
            tabIndex={tucked ? -1 : undefined}
            onClick={toggleSound}
          >
            <LayerImg slug={soundTile} />
          </Spot>
        </div>
        {!phone && (
          <div className="header-name">
            <Spot as={Link} to="/" box={CORNER.link} className="header-home" aria-label="Colin Zeng, home" aria-hidden={!tucked || undefined} tabIndex={tucked ? undefined : -1}>
              {/* each drawing flies from its spot in the sidebar (data-fly
                  names the sidebar element); the slot around it stays put
                  so the landing spot can be measured */}
              <span className="fly-slot" style={place(CORNER.name, CORNER.link)}>
                <span className="fly" data-fly="side-name">
                  <LayerImg slug="side-name" />
                </span>
              </span>
              <span className="fly-slot" style={place(CORNER.tagline, CORNER.link)}>
                <span className="fly" data-fly="side-tagline">
                  <LayerImg slug="side-tagline" />
                </span>
              </span>
            </Spot>
          </div>
        )}
        <Layer slug="piano" />
        <Keys current={span.from} pressed={pressed} onNav={handleNav} />
        {navKeys.map((k) => (
          <Layer key={k.to} slug={`label-${k.label}`} className={'key-label' + (k.label === span.from ? ' is-current' : '')} />
        ))}
        {/* one drawn stroke under the current page's label; on Home it sits
            under HOME over the landing and moves to EXPERIENCE once the case
            studies come into view (--nav-u) */}
        <span
          className="nav-underline"
          aria-hidden="true"
          style={{ top: from.top, height: from.height, '--x0': from.left, '--w0': from.width, '--x1': to.left, '--w1': to.width }}
        >
          <svg viewBox="0 0 200 16" preserveAspectRatio="none" focusable="false">
            <path d="M4 10 C36 6 80 5 122 5.5 C152 6 178 6.5 197 4.5 C189 9.5 160 11 130 11 C92 11.5 50 11.5 8 13.5 C3 13.5 1 11 4 10 Z" />
          </svg>
        </span>
      </CanvasRegion>
    </div>
  )
}
