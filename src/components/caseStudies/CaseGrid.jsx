import CaseCard from './CaseCard.jsx'
import { caseStudies } from '../../data/caseStudies.js'

// The case studies, two to a row (one on phones), under the Home landing.
// `matched` (ids) rings the cards a backpack skill led to; `matchKey` replays
// the ring when the same skill is picked again.
export default function CaseGrid({ studies = caseStudies, matched = [], matchKey }) {
  return (
    <div className="case-grid">
      {studies.map((s) => (
        <CaseCard key={s.id} study={s} ringKey={matched.includes(s.id) ? matchKey : null} />
      ))}
    </div>
  )
}
