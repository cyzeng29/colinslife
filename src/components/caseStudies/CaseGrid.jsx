import CaseCard from './CaseCard.jsx'
import { caseStudies } from '../../data/caseStudies.js'

// The case studies, two to a row (one on phones), under the Home landing.
export default function CaseGrid({ studies = caseStudies }) {
  return (
    <div className="case-grid">
      {studies.map((s) => (
        <CaseCard key={s.id} study={s} />
      ))}
    </div>
  )
}
