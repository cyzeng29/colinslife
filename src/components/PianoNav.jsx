import { Fragment, useState } from 'react'
import { NavLink } from 'react-router-dom'

// Each entry is one playable white key. Position them among the decorative
// black keys below by eye — the blackKeyPositions array is independent.
const playableKeys = [
  { to: '/', label: 'home' },
  { to: '/work', label: 'work' },
  { to: '/about', label: 'about' },
]

const blackKeyPositions = [42, 154, 266, 322] // px offsets, purely decorative

export default function PianoNav() {
  const [pressed, setPressed] = useState(null)

  function handleClick(label) {
    setPressed(label)
    setTimeout(() => setPressed(null), 140)
  }

  return (
    <div className="piano-wrap">
      <div className="piano-header">
        <div className="brand">Colin Zeng</div>
        <div className="brand-note mono">durham, nc</div>
      </div>
      <div className="piano">
        <div className="keys">
          {/* spacer key before the first playable one, matches original sketch */}
          <div className="key" />
          {playableKeys.map((k) => (
            <Fragment key={k.to}>
              <NavLink
                to={k.to}
                end={k.to === '/'}
                onClick={() => handleClick(k.label)}
                className={({ isActive }) =>
                  'key playable' +
                  (isActive ? ' active' : '') +
                  (pressed === k.label ? ' pressed' : '')
                }
              >
                <span className="label">{k.label}</span>
              </NavLink>
              <div className="key" />
            </Fragment>
          ))}
          {blackKeyPositions.map((left) => (
            <div className="black-key" style={{ left }} key={left} />
          ))}
        </div>
      </div>
    </div>
  )
}
