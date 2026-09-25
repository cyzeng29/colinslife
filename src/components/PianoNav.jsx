import { Fragment, useState } from 'react'
import { NavLink } from 'react-router-dom'

// Each entry is one playable white key. Position them among the decorative
// black keys below by eye — the blackKeyPositions array is independent.
const playableKeys = [
  { to: '/', label: 'home', shortcut: 'C' },
  { to: '/work', label: 'experience', shortcut: 'E', extraSpacer: true },
  { to: '/about', label: 'about', shortcut: 'A' },
]

const blackKeyPositions = [62, 222, 302, 462, 542, 622] // px offsets, purely decorative

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
                <span className="key-letter mono">{k.shortcut}</span>
                <span className="label">{k.label}</span>
              </NavLink>
              <div className="key" />
              {k.extraSpacer && <div className="key" />}
            </Fragment>
          ))}
          <div className="key" />
          {blackKeyPositions.map((left) => (
            <div className="black-key" style={{ left }} key={left} />
          ))}
        </div>
      </div>
    </div>
  )
}
