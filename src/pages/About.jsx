import Frame from '../components/Frame.jsx'
import InterestDesk from '../components/InterestDesk.jsx'
import { about } from '../data/content.js'

export default function About() {
  return (
    <section className="page-content">
      <p className="section-label mono">about</p>
      <div className="about-top">
        <div>
          <div className="about-body">
            {about.bio.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="about-list">
            <div>
              <span>Based in</span> — Durham, NC
            </div>
            <div>
              <span>School</span> — Duke University
            </div>
            <div>
              <span>Studying</span> — Computer Science, Statistics
            </div>
          </div>
        </div>
        <Frame kind="photo" ratio="4/5" {...about.photo} label="personal photo" className="about-photo" />
      </div>

      <InterestDesk table={about.desk.table} interests={about.interests} />
    </section>
  )
}
