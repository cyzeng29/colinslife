import { useState } from 'react'
import { Layer, LayerImg, Spot, useRegion } from './CanvasRegion.jsx'
import BackpackDialog from './BackpackDialog.jsx'
import { DESK_FRAME, DESK_SHIFT, hasLayer } from '../../data/landingGeometry.js'
import { experience, projects } from '../../data/content.js'

// Screen 2: Colin's desk, "who I am outside the resume", all drawn layers.
// The backpack unrolls the "what I have done…" scroll; the monitor switches
// its "designed with" screen on and off. The other objects' pop-ups are
// still being drawn, so a click only nudges them. Kora sleeps.
export default function Desk({ content }) {
  const { desk, backpack, monitor, dog } = content
  const region = useRegion()
  const [nudged, setNudged] = useState(null)
  const [screenOn, setScreenOn] = useState(false)
  const [backpackFrom, setBackpackFrom] = useState(null) // the opener while open

  const nudge = (slug) => ({
    className: 'desk-obj' + (nudged === slug ? ' is-nudged' : ''),
    onClick: () => setNudged(slug),
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
          </Spot>
        ))}

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
        </Spot>
        <Layer slug="popup-monitor" className={'monitor-screen' + (screenOn ? ' is-on' : '')} />

        <Layer slug="char-front" className="desk-char" />
      </div>

      {backpackFrom && (
        <BackpackDialog
          title={backpack.title}
          experience={experience}
          projects={projects}
          opener={backpackFrom}
          onClose={() => setBackpackFrom(null)}
        />
      )}
    </>
  )
}
