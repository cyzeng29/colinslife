import { Link } from 'react-router-dom'
import { asset } from '../Frame.jsx'

// One case study in the grid: its picture on a coloured tile, then the title
// ("Title @ where"), a "Discipline | Date" line, one line of summary and the
// skills. The title links to the case study's page and the link covers the
// whole card.
export default function CaseCard({ study }) {
  const { id, title, at, kind, date, summary, tile, tools } = study
  return (
    <article className="case-card">
      <div className={`case-tile is-${tile.fit}`} style={{ '--tile-bg': tile.bg }} aria-hidden="true">
        <img src={asset(tile.src)} alt="" loading="lazy" />
      </div>
      <div className="case-card-text">
        <h3 className="case-card-title">
          <Link to={`/work/${id}`} className="case-card-link">
            {title}
            {at && <span className="case-card-at"> @ {at}</span>}
          </Link>
        </h3>
        <p className="case-card-meta mono">
          {kind} | {date}
        </p>
        <p className="case-card-summary">{summary}</p>
        {tools.length > 0 && (
          <ul className="case-card-skills mono" aria-label="Skills">
            {tools.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}
