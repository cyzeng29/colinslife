import { Link } from 'react-router-dom'
import { LayerImg } from './CanvasRegion.jsx'
import { contact, resume } from '../../data/content.js'

const external = (href) => /^https?:/.test(href)

// The green column beside the scene: Colin's hand-lettered name and tagline
// (drawings, with their words as alt text), then plain-text facts (a bold
// label for where, a softer line for what), a row of contact links and the
// Recruiter Mode button, a link straight to the plain work list
// (/work/list). On wide screens it stays in view while the scene scrolls.
export default function LandingSidebar({ content }) {
  const { name, tagline, facts, recruiter } = content
  return (
    <aside className="landing-side">
      <h1 className="side-name">
        <LayerImg slug="side-name" alt={name} />
      </h1>
      <p className="side-tagline">
        <LayerImg slug="side-tagline" alt={tagline} />
      </p>
      <ul className="side-facts">
        {facts.map(({ label, detail }) => (
          <li key={label}>
            <span className="fact-label">{label}</span>
            <span className="fact-detail">{detail}</span>
          </li>
        ))}
      </ul>
      {/* contact links and Recruiter Mode move together, a fixed gap apart */}
      <div className="side-foot">
        <ul className="side-links" aria-label="Contact">
          {contact.map(({ label, href }) => (
            <li key={label}>
              <a href={href} {...(external(href) && { target: '_blank', rel: 'noopener noreferrer' })}>
                {label}
              </a>
            </li>
          ))}
          {resume.available && (
            <li>
              <a href={resume.href} target="_blank" rel="noopener noreferrer" aria-label="resume (PDF, opens in a new tab)">
                resume <span aria-hidden="true">↗</span>
              </a>
            </li>
          )}
        </ul>
        <Link to="/work/list" className="recruiter-mode" title="skip straight to the full list of experience & projects">
          {recruiter}
        </Link>
      </div>
    </aside>
  )
}
