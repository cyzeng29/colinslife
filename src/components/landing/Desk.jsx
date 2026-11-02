import { useEffect, useState } from 'react'
import { Layer, LayerImg, Spot, useRegion } from './CanvasRegion.jsx'
import BackpackDialog from './BackpackDialog.jsx'
import GlobeDialog from './GlobeDialog.jsx'
import { DESK_FRAME, DESK_SHIFT, hasLayer } from '../../data/landingGeometry.js'
import { places, skills } from '../../data/content.js'

// Screen 2: Colin's desk, "who I am outside the resume", all drawn layers.
// The backpack opens up to show the skills packed inside; the globe opens onto
// the places explored; the monitor switches its "designed with" screen on and
// off. The other objects' pop-ups are still being drawn, so a click only nudges
// them and says "soon". Kora sleeps.
const TOLD_MS = 1600
const TOP_SHELF = ['frisbee', 'globe']

// What an object does, shown on hover and focus. Its button's aria-label
// already says this for screen readers.
function DeskLabel({ slug, children }) {
  return (
    <span className={'desk-label' + (TOP_SHELF.includes(slug) ? ' is-below' : '')} aria-hidden="true">
      {children}
    </span>
  )
}

export default function Desk({ content }) {
  const { desk, globe, backpack, monitor, dog } = content
  const region = useRegion()
  const [nudged, setNudged] = useState(null)
  const [told, setTold] = useState(null) // the unfinished object saying "soon"
  const [screenOn, setScreenOn] = useState(false)
  const [backpackFrom, setBackpackFrom] = useState(null) // the opener while open
  const [globeFrom, setGlobeFrom] = useState(null) // the opener while open

  useEffect(() => {
    if (!told) return
    const timer = setTimeout(() => setTold(null), TOLD_MS)
    return () => clearTimeout(timer)
  }, [told])

  const nudge = (slug) => ({
    className: 'desk-obj' + (nudged === slug ? ' is-nudged' : '') + (told === slug ? ' is-told' : ''),
    onClick: () => {
      setNudged(slug)
      setTold(slug)
    },
    onAnimationEnd: () => setNudged(null),
  })

  return (
    <>
      <Spot box={DESK_FRAME} className="desk-panel" aria-hidden="true" />
      <div className="desk-group" style={{ transform: `translateY(${(DESK_SHIFT / region.h) * 100}%)` }}>
        <Layer slug="shelf" />
        <Spot role="img" slug="dog" className="desk-dog" aria-label={dog.alt}>
          <LayerImg slug="dog" />
          {hasLayer('zzz') ? (
            <LayerImg slug="zzz" className="dog-zzz-drawn" />
          ) : (
            <span className="dog-zzz" aria-hidden="true">
              <i>z</i>
              <i>z</i>
              <i>z</i>
            </span>
          )}
          <span className="dog-name mono" aria-hidden="true">
            {dog.name}
          </span>
        </Spot>
        <Layer slug="desk" />

        {desk.map((obj) => (
          <Spot key={obj.slug} as="button" type="button" slug={obj.slug} aria-label={`${obj.label} (details soon)`} {...nudge(obj.slug)}>
            <LayerImg slug={obj.slug} />
            <DeskLabel slug={obj.slug}>{obj.name}: soon</DeskLabel>
          </Spot>
        ))}

        <Spot
          as="button"
          type="button"
          slug="globe"
          className="desk-obj"
          aria-label={globe.label}
          aria-haspopup="dialog"
          onClick={(e) => setGlobeFrom(e.currentTarget)}
        >
          <LayerImg slug="globe" />
          <DeskLabel slug="globe">{globe.title}</DeskLabel>
        </Spot>

        <Spot
          as="button"
          type="button"
          slug="backpack"
          className="desk-obj"
          aria-label={backpack.label}
          aria-haspopup="dialog"
          onClick={(e) => setBackpackFrom(e.currentTarget)}
        >
          <LayerImg slug="backpack" />
          <DeskLabel>{backpack.title}</DeskLabel>
        </Spot>

        <Spot
          as="button"
          type="button"
          slug="monitor"
          className="desk-obj"
          aria-label={`${monitor.label}: ${monitor.screen}`}
          aria-pressed={screenOn}
          onClick={() => setScreenOn((on) => !on)}
        >
          <LayerImg slug="monitor" />
          <DeskLabel>{screenOn ? monitor.hintOff : monitor.hintOn}</DeskLabel>
        </Spot>
        <Layer slug="popup-monitor" className={'monitor-screen' + (screenOn ? ' is-on' : '')} />

        <Layer slug="char-front" className="desk-char" />
      </div>

      {backpackFrom && (
        <BackpackDialog
          title={backpack.title}
          skills={skills}
          opener={backpackFrom}
          onClose={() => setBackpackFrom(null)}
        />
      )}
      {globeFrom && (
        <GlobeDialog
          title={globe.title}
          places={places}
          opener={globeFrom}
          onClose={() => setGlobeFrom(null)}
        />
      )}
    </>
  )
}
