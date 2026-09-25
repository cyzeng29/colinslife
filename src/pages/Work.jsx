import WorkCard from '../components/WorkCard.jsx'
import { experience, projects } from '../data/content.js'

export default function Work() {
  return (
    <section className="page-content">
      <p className="section-label mono">experience</p>
      <div className="cards">
        {experience.map((item) => (
          <WorkCard key={item.title} {...item} />
        ))}
      </div>

      <p className="section-label mono">projects</p>
      <div className="cards">
        {projects.map((item) => (
          <WorkCard key={item.title} {...item} />
        ))}
      </div>
    </section>
  )
}
