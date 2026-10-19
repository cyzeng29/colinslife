import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { isMuted, playNote, setMuted } from '../audio/notes.js'
import { usePluck } from './PluckProvider.jsx'
import CanvasRegion, { Layer, LayerImg, Spot, place, useRegion } from './landing/CanvasRegion.jsx'
import useMediaQuery from '../hooks/useMediaQuery.js'
import { LAYERS, PIANO, hasLayer, stageRegions } from '../data/landingGeometry.js'

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
  { note: 'C', freq: 523.25, to: '/create', label: 'create' },
]


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
  const bar = stageRegions(phone).bar

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
        {/* just the drawn header (tiles, keys, labels): no backdrop, so the
            page shows through around it as it scrolls underneath */}
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
            <Layer key={k.to} slug={`label-${k.label}`} className="key-label" />
          ))}
      </CanvasRegion>
    </div>
  )
}
