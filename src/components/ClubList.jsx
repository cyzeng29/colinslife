import Frame from './Frame.jsx'

// "duke" section on the About page: a compact list of clubs. Role, years,
// blurb and link are optional; clubs with a photo get a taped frame beside
// the list.
export default function ClubList({ clubs }) {
  if (!clubs.length) return null
  const photos = clubs.filter((c) => c.photo?.src)

  return (
    <section className="clubs" aria-label="Duke clubs">
      <p className="section-label mono">duke</p>
      <div className={'clubs-body' + (photos.length ? ' has-photos' : '')}>
        <ul className="clubs-list">
          {clubs.map((c) => {
            const meta = [c.role, c.when].filter(Boolean).join(' · ')
            return (
              <li key={c.name} className="club">
                <p className="club-name">
                  {c.href ? (
                    <a href={c.href} target="_blank" rel="noopener noreferrer">
                      {c.name} <span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    c.name
                  )}
                  {meta && <span className="club-meta mono">{meta}</span>}
                </p>
                {c.blurb && <p className="club-blurb">{c.blurb}</p>}
              </li>
            )
          })}
        </ul>
        {photos.length > 0 && (
          <div className="clubs-photos">
            {photos.map((c) => (
              <Frame key={c.name} kind="photo" ratio="4/3" {...c.photo} caption={c.photo.caption || c.name} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
