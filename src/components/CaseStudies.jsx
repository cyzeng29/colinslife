import { useState } from 'react'
import WorkCard from './WorkCard.jsx'
import ExperienceDialog from './ExperienceDialog.jsx'

// Project sheets under the Home landing, using the same card and detail
// dialog as the Work page.
export default function CaseStudies({ projects }) {
  const [open, setOpen] = useState(null) // { id, opener }
  const openIndex = open ? projects.findIndex((p) => p.id === open.id) : -1

  return (
    <section className="page-content case-studies" aria-labelledby="case-studies-label">
      <h2 className="section-label mono" id="case-studies-label">
        case studies
      </h2>
      <div className="cards">
        {projects.map((p, i) => (
          <WorkCard key={p.id} entry={p} index={i} kind="project" onOpen={(id, opener) => setOpen({ id, opener })} />
        ))}
      </div>
      {openIndex >= 0 && (
        <ExperienceDialog
          key={open.id}
          entry={projects[openIndex]}
          kind="project"
          index={openIndex}
          total={projects.length}
          opener={open.opener}
          onClose={() => setOpen(null)}
        />
      )}
    </section>
  )
}
