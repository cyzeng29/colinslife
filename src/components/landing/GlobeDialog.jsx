import { useRef, useState } from 'react'
import GlobeCanvas from './GlobeCanvas.jsx'
import PlacePhotos from './PlacePhotos.jsx'
import { maxZoom } from './globeProjection.js'
import useMediaQuery from '../../hooks/useMediaQuery.js'
import useModalDialog from '../../hooks/useModalDialog.js'

const VIEWS = [
  { id: 'flat', label: '2d' },
  { id: 'globe', label: '3d' },
]
const HINTS = { flat: 'pick a marker, or click the map to zoom in', globe: 'drag to spin, scroll to zoom, or pick a marker' }
const ZOOMED_HINTS = { flat: 'drag to look around, or pick a marker', globe: 'drag to spin, or pick a marker' }

// Everywhere Colin has been: a dotted world map that curls into a globe and
// back. Places are named as their markers are hovered or picked. The hidden
// list says everything the map does, for anyone who can't see or point at it:
// tabbing onto a place picks it, so the caption and marker show where focus is.
// A picked place with photos shows them in a strip under the caption.
export default function GlobeDialog({ title, places, opener, onClose }) {
  const ref = useRef(null)
  const onKeyDown = useModalDialog(ref, { onClose, opener, focusSelector: '.gl-close' })
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [view, setView] = useState('flat')
  const [{ selected, turnKey }, setPick] = useState({ selected: null, turnKey: 0 })
  const pick = (place) => setPick((p) => ({ selected: place, turnKey: p.turnKey + 1 }))

  const [hovered, setHovered] = useState(null)
  const [zoom, setZoom] = useState(1)
  const mapRef = useRef(null)
  const zoomed = zoom > 1.01
  const shown = hovered || selected

  const caption = shown ? [shown.name, shown.note].filter(Boolean).join(': ') : (zoomed ? ZOOMED_HINTS : HINTS)[view]
  const photos = selected?.photos ?? []

  return (
    <dialog
      ref={ref}
      className="bp-dialog gl-dialog"
      aria-labelledby="gl-title"
      onKeyDown={onKeyDown}
      // Same as the backpack: a click on anything but the contents is a click
      // on the backdrop
      onClick={(e) => e.target.closest('button, canvas, .gl-title, .gl-caption, .gl-photos') || onClose()}
    >
      <div className={'gl-stage' + (photos.length ? ' has-photos' : '')}>
        <header className="gl-head">
          <h2 id="gl-title" className="gl-title">
            {title}
          </h2>
          <div className="gl-views" role="group" aria-label="map view">
            {VIEWS.map((v) => (
              <button
                key={v.id}
                type="button"
                className="gl-view"
                aria-pressed={view === v.id}
                onClick={() => setView(v.id)}
              >
                {v.label}
              </button>
            ))}
          </div>
          <button type="button" className="bp-close gl-close" aria-label="close" onClick={onClose}>
            <span aria-hidden="true">×</span>
          </button>
        </header>
        <ul className="sr-only">
          {places.map((place) => (
            <li key={place.name}>
              <button
                type="button"
                aria-pressed={selected === place}
                onClick={() => pick(place)}
                onFocus={() => pick(place)}
              >
                {place.name}
              </button>
            </li>
          ))}
        </ul>
        <div className="gl-map">
          <GlobeCanvas
            ref={mapRef}
            places={places}
            onZoom={setZoom}
            zoomed={zoomed}
            view={view}
            selected={selected}
            turnKey={turnKey}
            onSelect={pick}
            onHover={setHovered}
            reducedMotion={reducedMotion}
            label={`map of places explored, shown ${view === 'globe' ? 'as a globe; arrow keys turn it, plus and minus zoom' : 'flat'}`}
          />
          <div className="gl-zoom" role="group" aria-label="zoom">
            {/* aria-disabled, not disabled: a focused button at its limit keeps focus */}
            <button type="button" aria-label="zoom in" aria-disabled={zoom >= maxZoom(view) - 0.01} onClick={() => zoom < maxZoom(view) - 0.01 && mapRef.current?.zoomIn()}>
              <span aria-hidden="true">+</span>
            </button>
            <button type="button" aria-label="zoom out" aria-disabled={!zoomed} onClick={() => zoomed && mapRef.current?.zoomOut()}>
              <span aria-hidden="true">−</span>
            </button>
          </div>
        </div>
        <p className="gl-caption" aria-live="polite">
          {caption}
        </p>
        {photos.length > 0 && <PlacePhotos key={selected.name} place={selected.name} photos={photos} />}
      </div>
    </dialog>
  )
}
