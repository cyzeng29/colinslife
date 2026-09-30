import Frame from '../components/Frame.jsx'
import { HomeAccents } from '../components/Doodles.jsx'
import { home, resume } from '../data/content.js'

export default function Home() {
  return (
    <section className="page-content home">
      <div className="home-text">
        <h1 className="home-title">
          Colin Zeng,
          <br />
          Duke University.
        </h1>
        <p className="home-role">{home.intro}</p>
        <div className="home-links">
          <a href="mailto:colin.zeng@duke.edu">email</a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            github
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            linkedin
          </a>
          {resume.available ? (
            <a
              href={resume.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Resume (PDF, opens in a new tab)"
            >
              resume <span aria-hidden="true">↗</span>
            </a>
          ) : (
            <span className="link-soon" title="Resume coming soon">
              resume · soon
            </span>
          )}
        </div>
      </div>

      <div className="home-visual">
        <HomeAccents />
        <Frame kind="photo" ratio="4/5" {...home.photo} label="photo or illustration" />
        <span className="home-fig mono" aria-hidden="true">
          fig. 1
        </span>
      </div>
    </section>
  )
}
