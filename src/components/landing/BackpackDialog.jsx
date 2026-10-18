import { useRef } from 'react'
import { layerSrc } from './CanvasRegion.jsx'
import useModalDialog from '../../hooks/useModalDialog.js'

// Colin's drawn scroll ("what I have done…") that unrolls out of the
// backpack. The writing area is filled from content.js: each experience,
// then every tool used across experience and projects.
export default function BackpackDialog({ title, experience, projects, opener, onClose }) {
  const ref = useRef(null)
  const onKeyDown = useModalDialog(ref, { onClose, opener, focusSelector: '.bp-close' })
  const skills = [...new Set([...experience, ...projects].flatMap((e) => (e.tools ? e.tools.split(' · ') : [])))]

  return (
    <dialog
      ref={ref}
      className="bp-dialog"
      aria-labelledby="bp-title"
      onKeyDown={onKeyDown}
      // Clicks on the backdrop land on the <dialog> itself
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bp-scroll">
        <img className="bp-art" src={layerSrc('popup-backpack')} alt="" draggable="false" />
        {/* the title is hand-written on the scroll */}
        <h2 id="bp-title" className="sr-only">
          {title}
        </h2>
        <div className="bp-body">
          <ul className="bp-list">
            {experience.map((e) => (
              <li key={e.id}>
                <span className="bp-role">{e.title}</span>
                <span className="bp-org">{e.org}</span>
                <span className="bp-when mono">{e.when}</span>
              </li>
            ))}
          </ul>
          {skills.length > 0 && (
            <>
              <h3 className="bp-skills-title mono">skills</h3>
              <ul className="bp-skills">
                {skills.map((s) => (
                  <li key={s} className="mono">
                    {s}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        <button type="button" className="bp-close mono" onClick={onClose}>
          close
        </button>
      </div>
    </dialog>
  )
}
