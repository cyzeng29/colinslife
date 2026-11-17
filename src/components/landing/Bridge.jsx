import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Layer, LayerImg, Spot } from './CanvasRegion.jsx'
import { asset } from '../Frame.jsx'
import { BUBBLE, BUBBLE_BELOW, FOG, LAYERS } from '../../data/landingGeometry.js'

// The seam between the strings and the desk: the Duke Gardens bridge, the
// fog around it (drawn clouds once added, soft CSS fog until then) and the
// two ground markers. Hovering or clicking the "!" marker shows where Colin
// lives: a photo of the real bridge, captioned (a placeholder bubble until the
// drawn one arrives).
export default function Bridge({ text, photo }) {
  const [hovered, setHovered] = useState(false)
  const [pinned, setPinned] = useState(false)
  const open = hovered || pinned
  const [below, setBelow] = useState(false)
  const bubbleRef = useRef(null)

  // Opens above the marker if it fits under the piano bar, else below it.
  // Measured before paint, so it never shows in the wrong place first.
  useLayoutEffect(() => {
    if (!open) return setBelow(false)
    if (below) return
    const top = bubbleRef.current?.getBoundingClientRect().top ?? 0
    const bar = document.querySelector('.piano-wrap')?.getBoundingClientRect().bottom ?? 0
    if (top < bar + 8) setBelow(true)
  }, [open, below])
  const clouds = ['cloud-1', 'cloud-2', 'cloud-3'].filter((c) => LAYERS[c])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      setPinned(false)
      setHovered(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // A click pins the bubble open (so it survives the pointer leaving); a
  // second click closes it.
  const toggle = () => {
    if (!pinned) return setPinned(true)
    setPinned(false)
    setHovered(false)
  }

  return (
    <>
      {clouds.length > 0 ? (
        clouds.map((c) => <Layer key={c} slug={c} className="fog-cloud" />)
      ) : (
        <Spot box={FOG} className="fog" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={`fog-blob fog-blob-${i}`} />
          ))}
        </Spot>
      )}

      <Layer slug="bridge" className="bridge" />

      <Layer slug="marker-swirl" className="marker-swirl" />
      <Spot
        as="button"
        type="button"
        slug="marker-alert"
        className="marker-alert"
        aria-label="where i live"
        aria-expanded={open}
        aria-controls="bridge-bubble"
        onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={toggle}
      >
        <LayerImg slug="marker-alert" />
      </Spot>

      <Spot
        ref={bubbleRef}
        box={below ? BUBBLE_BELOW : BUBBLE}
        id="bridge-bubble"
        className={'bubble' + (below ? ' is-below' : '')}
        role="status"
        hidden={!open}
      >
        {photo?.src && <img className="bubble-photo" src={asset(photo.src)} alt={photo.alt} draggable="false" />}
        <p className="bubble-text">{text}</p>
      </Spot>
    </>
  )
}
