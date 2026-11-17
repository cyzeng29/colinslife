import CaseCard from './CaseCard.jsx'
import { caseStudies } from '../../data/caseStudies.js'

// The case studies, two to a row (one on phones), under the Home landing.
// `matched` (ids) rings the cards a backpack skill led to; `matchKey` replays
// the ring when the same skill is picked again. `compact` lays out smaller
// cards, three to a row, for "Other projects".
export default function CaseGrid({ studies = caseStudies, matched = [], matchKey, compact = false }) {
  return (
    <div className={compact ? 'case-grid is-compact' : 'case-grid'}>
      {studies.map((s) => (
        <CaseCard key={s.id} study={s} compact={compact} ringKey={matched.includes(s.id) ? matchKey : null} />
      ))}
    </div>
  )
}
