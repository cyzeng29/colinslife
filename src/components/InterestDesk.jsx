import { useEffect, useRef, useState } from 'react'
import Frame, { asset } from './Frame.jsx'
import InterestPath from './InterestPath.jsx'
import Sketchbook from './Sketchbook.jsx'
import { Penguin } from './Doodles.jsx'
import usePianoHeight from '../hooks/usePianoHeight.js'

// The About desk: the selected interest's penguin dropped into a soft pool of
// light. Switching interests sends the old penguin off while the new one
// falls in from the top of the frame and bounces (styled in index.css).
export default function InterestDesk({ interests }) {
  const [selected, setSelected] = useState(interests[0].id)
  const [leaving, setLeaving] = useState(null)
  const [broken, setBroken] = useState({})
  const [inView, setInView] = useState(false)
  const stageRef = useRef(null)
  usePianoHeight() // sets --piano-h, which sizes the scene and offsets focus scrolling
  const current = interests.find((i) => i.id === selected)
  const previous = interests.find((i) => i.id === leaving)

  // Warm the cache so a penguin never drops in half-loaded.
  useEffect(() => {
    interests.forEach((it) => {
      if (it.penguin?.src) new Image().src = asset(it.penguin.src)
    })
  }, [interests])

  // Hold the first drop until the desk scrolls into view.
  useEffect(() => {
    const el = stageRef.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setInView(true)
        io.disconnect()
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  function select(id) {
    if (id === selected) return
    setLeaving(selected)
    setSelected(id)
  }

  const markBroken = (key) => setBroken((b) => ({ ...b, [key]: true }))
  const showPenguin = current.penguin?.src && !broken[current.id]

  return (
    <div className="desk">
      <div className="desk-scene">
        <InterestPath interests={interests} selected={selected} onSelect={select} />

        <div ref={stageRef} className={'desk-stage' + (inView ? '' : ' is-waiting')}>
          <span className="desk-light" aria-hidden="true" />

          {previous?.penguin?.src && !broken[previous.id] && (
            <img
              key={`leaving-${previous.id}`}
              className="desk-penguin is-leaving"
              src={asset(previous.penguin.src)}
              alt=""
              aria-hidden="true"
              onAnimationEnd={() => setLeaving(null)}
            />
          )}

          <span className="desk-shadow" key={`shadow-${current.id}`} aria-hidden="true" />
          {showPenguin ? (
            <img
              key={current.id}
              className="desk-penguin"
              src={asset(current.penguin.src)}
              alt={current.penguin.alt}
              onError={() => markBroken(current.id)}
            />
          ) : (
            <span className="desk-penguin-fallback" key={current.id} aria-hidden="true">
              <Penguin />
            </span>
          )}
        </div>

        {current.caption && (
          <p className="desk-caption" key={`caption-${current.id}`}>
            {current.caption}
          </p>
        )}
      </div>

      <div className="desk-panel" role="tabpanel" id="desk-panel" aria-labelledby={`desk-tab-${current.id}`}>
        <div className={'desk-panel-inner' + (current.layout === 'sketchbook' ? ' is-sketchbook' : ' is-gallery')} key={current.id}>
          <p className="desk-panel-label mono">{current.label}</p>
          {current.layout === 'sketchbook' ? (
            <Sketchbook pages={current.images} />
          ) : (
            <div className="desk-gallery">
              {current.images.map((img, i) => (
                <Frame
                  key={i}
                  kind={img.kind}
                  ratio={img.ratio}
                  src={img.src}
                  alt={img.alt}
                  label={img.placeholder}
                  caption={img.caption}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
