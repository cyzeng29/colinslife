import { useEffect, useState } from 'react'
import { Layer, LayerImg, Spot } from './CanvasRegion.jsx'
import { BUBBLE, FOG, LAYERS } from '../../data/landingGeometry.js'

// The seam between the strings and the desk: the Duke Gardens bridge, the
// fog around it (drawn clouds once added, soft CSS fog until then) and the
// two ground markers. Hovering the bridge, or clicking it or the "!" marker,
// shows where Colin lives (a placeholder bubble until the drawn one arrives).
export default function Bridge({ text }) {
  const [hovered, setHovered] = useState(false)
  const [pinned, setPinned] = useState(false)
  const open = hovered || pinned
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

      <Spot
        as="button"
        type="button"
        slug="bridge"
        className="bridge"
        aria-label="the bridge: where i live"
        aria-expanded={open}
        aria-controls="bridge-bubble"
        onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={toggle}
      >
        <LayerImg slug="bridge" />
      </Spot>

      <Layer slug="marker-swirl" className="marker-swirl" />
      <Spot
        as="button"
        type="button"
        slug="marker-alert"
        className="marker-alert"
        aria-label="where i live"
        aria-expanded={open}
        aria-controls="bridge-bubble"
        onClick={toggle}
      >
        <LayerImg slug="marker-alert" />
      </Spot>

      <Spot as="p" box={BUBBLE} id="bridge-bubble" className="bubble" role="status" hidden={!open}>
        {text}
      </Spot>
    </>
  )
}
