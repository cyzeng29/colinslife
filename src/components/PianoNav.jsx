import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { isMuted, playNote, setMuted } from '../audio/notes.js'
import { usePluck } from './PluckProvider.jsx'
import CanvasRegion, { Layer, LayerImg, Spot, place, useRegion } from './landing/CanvasRegion.jsx'
import useMediaQuery from '../hooks/useMediaQuery.js'
import useScrolled from '../hooks/useScrolled.js'
import { LAYERS, PIANO, PIANO_PANEL, hasLayer, stageRegions } from '../data/landingGeometry.js'

// One real octave, C4 to C5, matching the drawn keys. Keys with `to` navigate
// (each carries a drawn label and hangs a string on the Home landing); the
// rest only play their note.
export const octave = [
  { note: 'C', freq: 261.63, to: '/', label: 'home' },
  { note: 'D', freq: 293.66 },
  { note: 'E', freq: 329.63, to: '/work', label: 'experience' },
  { note: 'F', freq: 349.23 },
  { note: 'G', freq: 392.0 },
  { note: 'A', freq: 440.0, to: '/about', label: 'about' },
  { note: 'B', freq: 493.88 },
  { note: 'C', freq: 523.25, to: '/encore', label: 'encore' },
]

// The encore label falls back to the drawn COLIN label until it's redrawn
const labelSlug = (label) => (label === 'encore' && !hasLayer('label-encore') ? 'label-colin' : `label-${label}`)

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

function Keys({ pressed, onNav }) {
  const region = useRegion()
  return octave.map((k, i) => {
    const { box, clipPath } = keyShape(i)
    const style = { ...place(box, region), clipPath }
    return k.to ? (
      <NavLink
        key={k.to}
        to={k.to}
        end
        data-string={k.to}
        style={style}
        onClick={(e) => onNav(e, k)}
        onPointerEnter={(e) => e.pointerType === 'mouse' && playNote(k.freq)}
        onPointerDown={(e) => e.pointerType !== 'mouse' && playNote(k.freq)}
        className={({ isActive }) =>
          'key playable' +
          (isActive ? ' active' : '') +
          (pressed === k.label ? ' pressed' : '')
        }
      >
        <span className="sr-only">{k.label}</span>
      </NavLink>
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
  const scrolled = useScrolled()
  const { pathname } = useLocation()
  // At the top of Home the drawn band flows into the hall below; anywhere
  // else it floats over the page as one whole rounded panel.
  const floating = scrolled || pathname !== '/'
  const bar = stageRegions(phone).bar
  const cornerH = 2 * PIANO_PANEL.r // canvas px at the bottom left to the panel alone

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
    <div className="piano-wrap">
      <CanvasRegion region={bar} className="piano-region">
        {/* floating: the drawing (and its glow) stops above the bottom
            corners; the panel covers its inside and rounds those corners */}
        <Layer slug="frame-top" style={floating ? { clipPath: `inset(0 0 ${(cornerH / bar.h) * 100}% 0)` } : undefined} />
        {floating && (
          <Spot
            box={PIANO_PANEL}
            className="piano-panel"
            aria-hidden="true"
            style={{ '--corner': `${(PIANO_PANEL.r / PIANO_PANEL.w) * 100}% ${(PIANO_PANEL.r / PIANO_PANEL.h) * 100}%`, '--glow-from': `${100 - (cornerH / PIANO_PANEL.h) * 100}%` }}
          />
        )}
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
          onClick={toggleSound}
        >
          <LayerImg slug={soundTile} />
        </Spot>
        <Layer slug="piano" />
        <Keys pressed={pressed} onNav={handleNav} />
        {octave
          .filter((k) => k.to)
          .map((k) => (
            <Layer key={k.to} slug={labelSlug(k.label)} className="key-label" />
          ))}
      </CanvasRegion>
    </div>
  )
}
