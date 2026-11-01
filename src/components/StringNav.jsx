import { Link } from 'react-router-dom'
import { playNote } from '../audio/notes.js'
import { LayerImg } from './landing/CanvasRegion.jsx'
import { LAYERS } from '../data/landingGeometry.js'

// A drawn eighth note: the head fills in (--on) for the current page
function NoteMark() {
  return (
    <svg className="string-note-mark" viewBox="0 0 24 32" focusable="false" aria-hidden="true">
      <path className="stem" d="M15 24.5 C15.2 17 14.8 10 15 3.5 C17.5 7 21.5 8.5 20.5 15" />
      <ellipse className="head" cx="10" cy="25" rx="5.6" ry="4.2" transform="rotate(-22 10 25)" />
    </svg>
  )
}

// A drawing at its own proportions, sized by the CSS height of its box
const Drawn = ({ slug, className }) => {
  const box = LAYERS[slug]
  if (!box) return null
  return (
    <span className={className} style={{ aspectRatio: `${box.w} / ${box.h}` }}>
      <LayerImg slug={slug} />
    </span>
  )
}

// The drawn stroke under the current page's label, shared with the piano
export function UnderlineStroke() {
  return (
    <svg viewBox="0 0 200 16" preserveAspectRatio="none" focusable="false">
      <path d="M4 10 C36 6 80 5 122 5.5 C152 6 178 6.5 197 4.5 C189 9.5 160 11 130 11 C92 11.5 50 11.5 8 13.5 C3 13.5 1 11 4 10 Z" />
    </svg>
  )
}

// a label drawing's width over its height, so the underline can match it
const labelRatio = (label) => {
  const box = LAYERS[`label-${label}`]
  return box ? box.w / box.h : 4
}

// The slim header that takes over from the piano once it condenses: Colin's
// name, then a drawn string with a note for each page and its label beneath.
// On Home the current note follows --nav-u (HOME → EXPERIENCE as the case
// studies arrive); elsewhere it's the page's own. `hidden` while the piano
// shows, so only one set of links is exposed at a time.
export default function StringNav({ keys, current, home, phone, hidden, pressed, onNav }) {
  const on = (label) => {
    if (!home) return label === current ? 1 : 0
    if (label === 'home') return 'calc(1 - var(--nav-u, 0))'
    return label === 'experience' ? 'var(--nav-u, 0)' : 0
  }
  const tab = hidden ? -1 : undefined

  // the underline sits under the current label (by its slot --i and drawn
  // width --r); on Home it glides HOME → EXPERIENCE with --nav-u
  const slot = (label) => Math.max(0, keys.findIndex((k) => k.label === label))
  const lerp = (a, b) => `calc(${a} + ${b - a} * var(--nav-u, 0))`
  const underline = home
    ? { '--i': lerp(slot('home'), slot('experience')), '--r': lerp(labelRatio('home'), labelRatio('experience')) }
    : { '--i': slot(current), '--r': labelRatio(current) }

  return (
    <div className="string-nav" aria-hidden={hidden || undefined}>
      {!phone && (
        <Link to="/" className="string-nav-name" aria-label="Colin Zeng, home" tabIndex={tab}>
          {/* flies up from the sidebar's name on Home (useHeaderCondense) */}
          <span className="fly" data-fly="side-name">
            <Drawn slug="side-name" className="string-nav-name-img" />
          </span>
        </Link>
      )}
      {/* on Home the line rides up beneath the piano as it's pushed away,
          shown only inside the shrinking header (clip in CSS) */}
      <div className="string-nav-window">
        <div className="string-nav-line">
          <svg className="string-nav-wire" viewBox="0 0 400 8" preserveAspectRatio="none" focusable="false" aria-hidden="true">
            <path d="M1 4.5 C60 3.2 120 5.4 200 4.2 C280 3 340 5.2 399 3.8" />
          </svg>
          <ol>
            {keys.map((k) => (
              <li key={k.to}>
                <Link
                  to={k.to}
                  tabIndex={tab}
                  className={'string-note' + (pressed === k.label ? ' pressed' : '')}
                  aria-current={current === k.label ? 'page' : undefined}
                  style={{ '--on': on(k.label) }}
                  onClick={(e) => onNav(e, k)}
                  onPointerEnter={(e) => e.pointerType === 'mouse' && playNote(k.freq)}
                  onPointerDown={(e) => e.pointerType !== 'mouse' && playNote(k.freq)}
                >
                  <NoteMark />
                  <Drawn slug={`label-${k.label}`} className="string-note-label" />
                  <span className="sr-only">{k.label}</span>
                </Link>
              </li>
            ))}
          </ol>
          <span className="string-nav-underline" aria-hidden="true" style={{ '--n': keys.length, ...underline }}>
            <UnderlineStroke />
          </span>
        </div>
      </div>
    </div>
  )
}
