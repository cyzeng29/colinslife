import { useRef } from 'react'
import { Penguin } from './Doodles.jsx'

// Interest picker: one circle per interest on an ink line, with a small penguin
// that slides to the selected stop. The circles are a tablist (arrow keys,
// Home/End) controlling the desk panel.
export default function InterestPath({ interests, selected, onSelect }) {
  const tabRefs = useRef({})
  const index = interests.findIndex((i) => i.id === selected)
  const prevIndex = useRef(index)
  const facingLeft = useRef(false)
  if (index !== prevIndex.current) {
    facingLeft.current = index < prevIndex.current
    prevIndex.current = index
  }

  function onTabKey(e, i) {
    const last = interests.length - 1
    const next = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: last }[e.key]
    if (next === undefined) return
    e.preventDefault()
    const target = interests[(next + interests.length) % interests.length]
    onSelect(target.id)
    tabRefs.current[target.id]?.focus()
  }

  return (
    <div className="desk-path" style={{ '--count': interests.length, '--index': index }}>
      <span className="desk-path-line" aria-hidden="true" />
      <span className={'desk-path-penguin' + (facingLeft.current ? ' is-left' : '')} aria-hidden="true">
        <span className="desk-path-waddle" key={index}>
          <Penguin />
        </span>
      </span>

      <div className="desk-path-stops" role="tablist" aria-label="Interests">
        {interests.map((it, i) => (
          <button
            key={it.id}
            ref={(el) => (tabRefs.current[it.id] = el)}
            type="button"
            role="tab"
            id={`desk-tab-${it.id}`}
            aria-selected={it.id === selected}
            aria-controls="desk-panel"
            tabIndex={it.id === selected ? 0 : -1}
            className="desk-stop"
            onClick={() => onSelect(it.id)}
            onKeyDown={(e) => onTabKey(e, i)}
          >
            <span className="desk-stop-dot" aria-hidden="true" />
            <span className="desk-stop-label mono">{it.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
