import { useState } from 'react'
import Frame from './Frame.jsx'

// "duke" section on the About page: one club at a time, each with an ink-framed
// photo (or a placeholder) and its caption. Prev/next and the arrow keys
// cycle through the clubs, wrapping at either end. Role, years, blurb, link
// and photo caption are optional.
export default function ClubCarousel({ clubs }) {
  const [index, setIndex] = useState(0)
  if (!clubs.length) return null

  const club = clubs[index] ?? clubs[0]
  const count = clubs.length
  const step = (by) => setIndex((i) => (i + by + count) % count)
  const meta = [club.role, club.when].filter(Boolean).join(' · ')

  function onKeyDown(e) {
    if (e.key === 'ArrowRight') step(1)
    else if (e.key === 'ArrowLeft') step(-1)
    else return
    e.preventDefault()
  }

  return (
    <section className="clubs" aria-label="Duke clubs">
      <p className="section-label mono">duke</p>
      <div
        className="club-carousel"
        role="group"
        aria-roledescription="carousel"
        aria-label="Duke clubs. Use the arrow keys to cycle."
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        <div
          className="club-slide"
          key={club.name}
          role="group"
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${count}: ${club.name}`}
        >
          <Frame kind="photo" ratio="4/3" {...club.photo} label="photo" caption={club.photo?.caption} />
          <div className="club-text" aria-live="polite">
            <h3 className="club-name">
              {club.href ? (
                <a href={club.href} target="_blank" rel="noopener noreferrer">
                  {club.name} <span aria-hidden="true">↗</span>
                </a>
              ) : (
                club.name
              )}
            </h3>
            {meta && <p className="club-meta mono">{meta}</p>}
            {club.blurb && <p className="club-blurb">{club.blurb}</p>}
          </div>
        </div>

        {count > 1 && (
          <div className="sb-controls club-controls mono">
            <button type="button" onClick={() => step(-1)}>
              <span aria-hidden="true">‹</span> prev<span className="sr-only"> club</span>
            </button>
            <span className="sb-count" aria-hidden="true">
              {index + 1} / {count}
            </span>
            <button type="button" onClick={() => step(1)}>
              next<span className="sr-only"> club</span> <span aria-hidden="true">›</span>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
