import { useEffect, useRef } from 'react'
import { Penguin } from './Doodles.jsx'

// Penguin timeline. A sticky vertical rail on wide screens and a sideways
// strip of chips on narrow ones (layout switches in index.css). Each penguin
// is a button that jumps to its sheet; opening the dialog stays on the sheet.
export default function ExperienceTimeline({ groups, activeId, onJump }) {
  const stripRef = useRef(null)

  // In strip mode, keep the current chip in view without moving the page
  useEffect(() => {
    const strip = stripRef.current
    if (!strip || strip.scrollWidth <= strip.clientWidth) return
    const btn = strip.querySelector('[aria-current]')
    if (!btn) return
    const s = strip.getBoundingClientRect()
    const b = btn.getBoundingClientRect()
    if (b.left < s.left || b.right > s.right) {
      strip.scrollLeft += b.left - s.left - (s.width - b.width) / 2
    }
  }, [activeId])

  return (
    <nav className="timeline" aria-label="Jump to an entry">
      <p className="tl-title mono" aria-hidden="true">
        jump to
      </p>
      <div className="tl-scroll" ref={stripRef}>
        {groups.map((g) => (
          <div className="tl-group" key={g.label}>
            <p className="tl-group-label mono" id={`tl-${g.label}`}>
              {g.label}
            </p>
            <ol aria-labelledby={`tl-${g.label}`}>
              {g.items.map((item) => {
                const active = item.id === activeId
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={'tl-item' + (active ? ' is-active' : '')}
                      aria-current={active ? 'location' : undefined}
                      onClick={() => onJump(item.id)}
                    >
                      <Penguin />
                      <span className="tl-text mono">
                        <span className="sr-only">Jump to </span>
                        {item.when && <span className="tl-when">{item.when}</span>}
                        <span className="tl-short">{item.short}</span>
                        <span className="sr-only">: {item.title}</span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </div>
        ))}
      </div>
    </nav>
  )
}
