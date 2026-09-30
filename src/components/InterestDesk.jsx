import { useRef, useState } from 'react'
import Frame from './Frame.jsx'

// Top-down ink sketch of a desk. Each object maps to an interest in
// content.js by id. The drawing is a pointer shortcut; the text tabs below it
// are the accessible control (same selection, arrow-key navigation).
const ART = {
  drawing: (
    <>
      <rect className="desk-hit" x="44" y="40" width="250" height="196" rx="18" />
      <g transform="rotate(-5 160 130)">
        <path d="M62 64 Q108 54 156 68 L156 196 Q108 182 64 192 Z" />
        <path d="M156 68 Q204 54 252 62 L248 188 Q204 180 156 196 Z" />
        <path d="M86 118 c0 -20 34 -20 34 0 c0 20 -34 20 -34 0 M92 150 l28 -4 M92 160 l20 -3" />
        <path d="M174 110 q10 -14 20 0 t20 0 t20 0 M176 140 l52 -4 M176 154 l40 -3" />
      </g>
      <path d="M214 212 L270 160 L278 168 L222 220 Z M270 160 L284 150 L278 168 M214 212 L208 218 L216 226 L222 220" />
    </>
  ),
  music: (
    <>
      <rect className="desk-hit" x="-44" y="-146" width="88" height="200" rx="20" transform="translate(372 170) rotate(58)" />
      <rect className="desk-hit" x="254" y="282" width="192" height="62" rx="10" />
      <g transform="translate(372 170) rotate(58)">
        <path d="M0 -40 C22 -40 26 -22 18 -12 C34 -4 38 26 22 40 C10 50 -10 50 -22 40 C-38 26 -34 -4 -18 -12 C-26 -22 -22 -40 0 -40 Z" />
        <circle cx="0" cy="6" r="9" />
        <path d="M-5 -40 L-5 -116 M5 -40 L5 -116 M-5 -62 h10 M-5 -84 h10 M-5 -104 h10" />
        <path d="M-6 -116 L-8 -138 L8 -138 L6 -116 Z M-8 -124 h-4 M8 -124 h4 M-8 -132 h-4 M8 -132 h4" />
        <path d="M-2 -136 L-2 30 M2 -136 L2 30 M-10 30 h20" />
      </g>
      <path d="M262 290 H438 V336 H262 Z M284 290 V336 M306 290 V336 M328 290 V336 M350 290 V336 M372 290 V336 M394 290 V336 M416 290 V336" />
      <path className="desk-fill" d="M280 290 h8 v26 h-8 Z M302 290 h8 v26 h-8 Z M346 290 h8 v26 h-8 Z M368 290 h8 v26 h-8 Z M390 290 h8 v26 h-8 Z" />
    </>
  ),
  pickleball: (
    <>
      <rect className="desk-hit" x="-42" y="-70" width="84" height="156" rx="20" transform="translate(108 300) rotate(-30)" />
      <circle className="desk-hit" cx="196" cy="332" r="24" />
      <g transform="translate(108 300) rotate(-30)">
        <path d="M-32 -45 Q-32 -60 -17 -60 L17 -60 Q32 -60 32 -45 L32 20 Q32 35 17 35 L-17 35 Q-32 35 -32 20 Z" />
        <path d="M-26 -40 Q-26 -54 -14 -54 L14 -54 Q26 -54 26 -40" />
        <path d="M-8 35 L-8 74 Q0 80 8 74 L8 35 M-8 48 h16 M-8 58 h16 M-8 68 h16" />
      </g>
      <circle cx="196" cy="332" r="16" />
      <path d="M189 325 m-2 0 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0 M203 326 m-2 0 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0 M196 339 m-2 0 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0" />
    </>
  ),
  frisbee: (
    <>
      <circle className="desk-hit" cx="568" cy="118" r="50" />
      <circle cx="568" cy="118" r="42" />
      <circle cx="568" cy="118" r="30" />
      <path d="M540 100 q10 -18 30 -20" />
    </>
  ),
  content: (
    <>
      <rect className="desk-hit" x="478" y="206" width="90" height="170" rx="16" />
      <path d="M500 218 H546 Q554 218 554 226 V310 Q554 318 546 318 H500 Q492 318 492 310 V226 Q492 218 500 218 Z" />
      <path d="M499 234 H547 V302 H499 Z M516 256 L534 268 L516 280 Z" />
      <circle cx="523" cy="226" r="2" />
      <circle className="desk-fill" cx="540" cy="243" r="3" />
      <path d="M510 318 V326 H536 V318 M523 326 L500 368 M523 326 L523 370 M523 326 L546 368" />
    </>
  ),
}

export default function InterestDesk({ interests }) {
  const [selected, setSelected] = useState(interests[0].id)
  const tabRefs = useRef({})
  const current = interests.find((i) => i.id === selected)

  function onTabKey(e, index) {
    const last = interests.length - 1
    const next = { ArrowRight: index + 1, ArrowDown: index + 1, ArrowLeft: index - 1, ArrowUp: index - 1, Home: 0, End: last }[
      e.key
    ]
    if (next === undefined) return
    e.preventDefault()
    const target = interests[(next + interests.length) % interests.length]
    setSelected(target.id)
    tabRefs.current[target.id]?.focus()
  }

  return (
    <div className="desk">
      <div className="desk-stage">
        <svg className="desk-art" viewBox="0 0 640 400" aria-hidden="true">
          <path
            className="desk-surface"
            d="M22 26 C180 18 460 20 618 28 C624 140 622 270 616 376 C450 384 190 382 24 374 C18 260 16 140 22 26 Z"
          />
          {interests.map((it) => (
            <g
              key={it.id}
              className={'desk-obj' + (it.id === selected ? ' is-selected' : '')}
              onClick={() => setSelected(it.id)}
            >
              {ART[it.id]}
            </g>
          ))}
        </svg>

        <div className="desk-tabs" role="tablist" aria-label="Interests">
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
              className="desk-tab mono"
              onClick={() => setSelected(it.id)}
              onKeyDown={(e) => onTabKey(e, i)}
            >
              {it.label}
            </button>
          ))}
        </div>
      </div>

      <div className="desk-panel" role="tabpanel" id="desk-panel" aria-labelledby={`desk-tab-${current.id}`}>
        <div className="desk-panel-inner" key={current.id}>
          <p className="desk-panel-label mono">{current.label}</p>
          <Frame
            kind={current.image.kind}
            ratio={current.image.ratio}
            src={current.image.src}
            alt={current.image.alt}
            label={current.image.placeholder}
            caption={current.caption}
          />
        </div>
      </div>
    </div>
  )
}
