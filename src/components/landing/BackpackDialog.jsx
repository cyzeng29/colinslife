import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { layerSrc } from './CanvasRegion.jsx'
import useModalDialog from '../../hooks/useModalDialog.js'
import { findCaseStudy } from '../../data/caseStudies.js'
import { BACKPACK } from '../../data/landingGeometry.js'

const HINT = 'pick a word to see where i used it'
const SIDES = ['top', 'left', 'right', 'bottom']

const percent = (value, of) => `${(value / of) * 100}%`
const groupId = (g) => `bp-group-${g.group.toLowerCase().replace(/[^a-z]+/g, '-')}`

// The backpack, filled in, with everything Colin carries popped out around it
// as bordered words under their headings, by side. Each word with a case study links
// down to it on Home.
export default function BackpackDialog({ title, skills, opener, onClose }) {
  const ref = useRef(null)
  const onKeyDown = useModalDialog(ref, { onClose, opener, focusSelector: '.bp-close' })
  const [active, setActive] = useState(null)

  const caption = active
    ? `${active.name}: ${active.studies.map((id) => findCaseStudy(id).title.toLowerCase()).join(', ')}`
    : HINT

  let popOrder = 0
  const renderWord = (word) => (
    <li
      key={word.name}
      className={`bp-word is-tier-${word.tier}` + (active === word ? ' is-active' : '')}
      style={{ '--i': popOrder++ }}
    >
      {word.studies.length > 0 ? (
        <Link
          className="bp-chip"
          to={`/#case-${word.studies[0]}`}
          state={{ matched: word.studies }}
          onClick={onClose}
          onMouseEnter={() => setActive(word)}
          onMouseLeave={() => setActive(null)}
          onFocus={() => setActive(word)}
          onBlur={() => setActive(null)}
        >
          {word.name}
        </Link>
      ) : (
        <span className="bp-chip">{word.name}</span>
      )}
    </li>
  )

  return (
    <dialog
      ref={ref}
      className="bp-dialog"
      aria-labelledby="bp-title"
      onKeyDown={onKeyDown}
      // The dialog fills the window, so a click on anything but the bag and
      // its words counts as a click on the backdrop
      onClick={(e) => e.target.closest('a, button, .bp-chip, .bp-bag') || onClose()}
    >
      <div className={'bp-stage' + (active ? ' has-active' : '')}>
        <button type="button" className="bp-close" aria-label="close" onClick={onClose}>
          <span aria-hidden="true">×</span>
        </button>
        <div className="bp-bag">
          <img src={layerSrc('backpack-filled')} alt="" draggable="false" />
          <h2
            id="bp-title"
            className="bp-title"
            style={{
              left: percent(BACKPACK.patch.x, BACKPACK.w),
              top: percent(BACKPACK.patch.y, BACKPACK.h),
              width: percent(BACKPACK.patch.w, BACKPACK.w),
              height: percent(BACKPACK.patch.h, BACKPACK.h),
            }}
          >
            {title}
          </h2>
        </div>
        {SIDES.map((side) => (
          <div key={side} className={`bp-side is-${side}`}>
            {skills
              .filter((g) => g.side === side)
              .map((g) => (
                <section key={g.group} className="bp-group" aria-labelledby={groupId(g)}>
                  <h3 id={groupId(g)} className="bp-group-title">
                    {g.group}
                  </h3>
                  <ul className="bp-words">{g.words.map(renderWord)}</ul>
                </section>
              ))}
          </div>
        ))}
        <p className="bp-caption" aria-live="polite">
          {caption}
        </p>
      </div>
    </dialog>
  )
}
