import Frame from './Frame.jsx'

// One "sheet" on the Work page. The whole sheet opens the detail dialog
// (via the stretched .sheet-open button); links inside stay clickable.
export default function WorkCard({ entry, index, kind, onOpen }) {
  const { id, title, org, when, bullets, tools, links = [], thumb } = entry
  const num = String(index + 1).padStart(2, '0')

  return (
    <article className="card sheet" id={id} aria-labelledby={`${id}-title`}>
      <div className="sheet-main">
        <p className="sheet-kicker mono">
          <span>{num}</span>
          {when && <span className="card-when">{when}</span>}
        </p>
        <h3 className="card-title" id={`${id}-title`} tabIndex={-1}>
          {title}
        </h3>
        {org && <p className="card-org">{org}</p>}
        <ul>
          {bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        {tools && <p className="card-tools">{tools}</p>}
        <div className="sheet-foot">
          {links.map((l) => (
            <a key={l.href} className="sheet-link mono" href={l.href} target="_blank" rel="noopener noreferrer">
              {l.label} <span aria-hidden="true">↗</span>
            </a>
          ))}
          <button type="button" className="sheet-open mono" onClick={(e) => onOpen(id, e.currentTarget)}>
            view {kind} <span aria-hidden="true">→</span>
            <span className="sr-only">: {title}</span>
          </button>
        </div>
      </div>
      {/* a click anywhere on the sheet opens the dialog, where images enlarge */}
      <Frame kind="drawing" ratio="4/3" {...thumb} label={`fig. ${num}`} className="sheet-thumb" zoomable={false} />
    </article>
  )
}
