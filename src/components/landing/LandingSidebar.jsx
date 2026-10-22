import { Link } from 'react-router-dom'
import { LayerImg } from './CanvasRegion.jsx'
import { contact, resume } from '../../data/content.js'
import { TAGLINE_LETTERS, hasLayer } from '../../data/landingGeometry.js'

const external = (href) => /^https?:/.test(href)

const pct = (n) => `${n * 100}%`

// The drawing minus the cut-out letters: everything above them, and the
// full stop after them
const TAGLINE_BASE_CLIP = (() => {
  const { w, h, top, stop } = TAGLINE_LETTERS
  const x = pct(stop / w)
  const y = pct(top / h)
  return `polygon(0 0, 100% 0, 100% 100%, ${x} 100%, ${x} ${y}, 0 ${y})`
})()

// A letter hops when the cursor reaches it (a hop already under way runs to
// the end), so a quick swipe sends a wave across the word.
function hop(e) {
  const el = e.currentTarget
  if (el.classList.contains('is-hopping')) return
  el.classList.add('is-hopping')
  el.addEventListener('animationend', () => el.classList.remove('is-hopping'), { once: true })
}

// "interactive" cut out of the drawing letter by letter, laid over it where
// it was drawn: each letter hops when the cursor reaches it and shows a glass
// lens while hovered. Decorative (the image's alt has the words).
function TaglineGlass() {
  const { w, h, top, bottom, letters } = TAGLINE_LETTERS
  const sliceH = bottom - top + 1
  return (
    <span className="tagline-glass" aria-hidden="true">
      {letters.map(([left, right], i) => {
        const sliceW = right - left + 1
        return (
          <span
            key={i}
            className="glass-letter"
            style={{ left: pct(left / w), width: pct(sliceW / w), top: pct(top / h), height: pct(sliceH / h) }}
            onPointerEnter={hop}
          >
            <span className="glass-hop">
              <span className="glass-ink">
                <LayerImg
                  slug="side-tagline"
                  className="glass-ink-art"
                  style={{
                    left: pct(-left / sliceW),
                    top: pct(-top / sliceH),
                    width: pct(w / sliceW),
                    height: pct(h / sliceH),
                  }}
                />
              </span>
            </span>
          </span>
        )
      })}
    </span>
  )
}

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
        <span className="tagline-art">
          <LayerImg slug="side-tagline" alt={tagline} style={{ clipPath: TAGLINE_BASE_CLIP }} />
          {hasLayer('side-tagline') && <TaglineGlass />}
        </span>
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
