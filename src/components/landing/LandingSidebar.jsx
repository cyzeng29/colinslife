import { Link } from 'react-router-dom'
import { LayerImg } from './CanvasRegion.jsx'

// The green column beside the scene: Colin's hand-lettered name and tagline
// (drawings, with their words as alt text), then plain-text facts and the
// Recruiter Mode button, a link straight to the plain work list. On wide
// screens it stays in view while the scene scrolls.
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
        {facts.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <Link to="/work" className="recruiter-mode" title="skip straight to experience & projects">
        {recruiter}
      </Link>
    </aside>
  )
}
