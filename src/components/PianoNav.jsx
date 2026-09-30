import { Fragment, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { playNote } from '../audio/notes.js'

// Each entry is one playable white key. Position them among the decorative
// black keys below by eye — the blackKeyPositions array is independent.
const playableKeys = [
  { to: '/', label: 'home', shortcut: 'C', freq: 261.63 },
  { to: '/work', label: 'experience', shortcut: 'E', freq: 329.63, extraSpacer: true },
  { to: '/about', label: 'about', shortcut: 'A', freq: 440.0 },
]

// Purely decorative. Each number is the white-key boundary a black key sits
// on, so they follow the key width (--key-w) on small screens too.
const blackKeyPositions = [1, 3, 4, 6, 7, 8]

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
                onPointerEnter={(e) => e.pointerType === 'mouse' && playNote(k.freq)}
                onPointerDown={(e) => e.pointerType !== 'mouse' && playNote(k.freq)}
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
          {blackKeyPositions.map((n) => (
            <div className="black-key" style={{ left: `calc(${n} * var(--key-w) - var(--black-w) / 2)` }} key={n} />
          ))}
        </div>
      </div>
    </div>
  )
}
