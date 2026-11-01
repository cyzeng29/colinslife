import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { asset } from '../components/Frame.jsx'
import { useLightbox } from '../components/Lightbox.jsx'
import usePianoHeight from '../hooks/usePianoHeight.js'
import useSectionSpy from '../hooks/useSectionSpy.js'
import { caseStudies, findCaseStudy } from '../data/caseStudies.js'

const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// A picture that enlarges in the lightbox
function Photo({ image, className = '' }) {
  const openLightbox = useLightbox()
  const src = asset(image.src)
  const img = <img src={src} alt={image.alt} loading="lazy" />
  return (
    <figure className={`cs-photo ${image.phone ? 'is-phone' : ''} ${className}`}>
      {openLightbox ? (
        <button
          type="button"
          className="cs-photo-zoom"
          aria-label={`Enlarge image: ${image.alt}`}
          onClick={(e) => openLightbox({ src, alt: image.alt, caption: image.caption, from: e.currentTarget.querySelector('img') })}
        >
          {img}
        </button>
      ) : (
        img
      )}
      {(image.title || image.caption) && (
        <figcaption>
          {image.title && <h3>{image.title}</h3>}
          {image.caption}
        </figcaption>
      )}
    </figure>
  )
}

// A silent screen recording: loops on its own unless motion is reduced, and
// leaves just its caption if the file can't be played
function Clip({ clip }) {
  const [failed, setFailed] = useState(false)
  return (
    <figure className="cs-photo">
      {!failed && (
        <video
          src={asset(clip.src)}
          aria-label={clip.alt}
          autoPlay={!reducedMotion()}
          muted
          loop
          playsInline
          controls
          preload="metadata"
          onError={() => setFailed(true)}
        />
      )}
      {clip.caption && <figcaption>{clip.caption}</figcaption>}
    </figure>
  )
}

const ExternalLinks = ({ links }) =>
  links.length > 0 && (
    <ul className="cs-links mono">
      {links.map((l) => (
        <li key={l.href}>
          <a href={l.href} target="_blank" rel="noopener noreferrer">
            {l.label} <span aria-hidden="true">↗</span>
          </a>
        </li>
      ))}
    </ul>
  )

// Consecutive paragraphs share one block of prose
const groupProse = (body) =>
  body.reduce((out, b) => {
    if (typeof b !== 'string') out.push(b)
    else if (Array.isArray(out.at(-1))) out.at(-1).push(b)
    else out.push([b])
    return out
  }, [])

// One piece of a section's body (the kinds are listed in caseStudies.js)
function Block({ block, links }) {
  if (Array.isArray(block))
    return (
      <div className="cs-prose">
        {block.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    )
  if (block.list)
    return (
      <ol className="cs-steps">
        {block.list.map((item) => (
          <li key={item}>
            <p>{item}</p>
          </li>
        ))}
      </ol>
    )
  if (block.points)
    return (
      <ol className="cs-steps">
        {block.points.map(([name, line]) => (
          <li key={name}>
            <h3>{name}</h3>
            <p>{line}</p>
          </li>
        ))}
      </ol>
    )
  if (block.images)
    return (
      <div className={`cs-gallery ${block.beside ? 'is-beside' : ''}`}>
        {block.images.map((image) => (
          <Photo key={image.src} image={image} />
        ))}
      </div>
    )
  if (block.video) return <Clip clip={block.video} />
  if (block.stats)
    return (
      <ul className="cs-results">
        {block.stats.map(([figure, label]) => (
          <li key={label}>
            <strong>{figure}</strong>
            <span>{label}</span>
          </li>
        ))}
      </ul>
    )
  if (block.challenges)
    return (
      <div className="cs-solution">
        <Photo image={block.image} />
        <div className="cs-challenges">
          <h3>Key challenges</h3>
          <ol>
            {block.challenges.map(([name, line]) => (
              <li key={name}>
                <em>{name}</em>
                <span>{line}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    )
  if (block.links) return <ExternalLinks links={links} />
  return null
}

const Blocks = ({ body, links }) => groupProse(body).map((block, i) => <Block key={i} block={block} links={links} />)

// One case study, opened from its card: its title and details line, then a
// sticky list of sections beside the story, each section as written (or
// built) in caseStudies.js.
export default function CaseStudy() {
  const { id } = useParams()
  const study = findCaseStudy(id)
  if (!study) return <Navigate to="/#case-studies" replace />
  return <CaseStudyPage key={study.id} study={study} />
}

function CaseStudyPage({ study }) {
  const { title, at, headline, role, when, tools, links } = study
  const [first, ...rest] = study.sections
  const headingRef = useRef(null)
  usePianoHeight() // --piano-h, so jumps land just under the sticky piano

  const sections = study.sections.map((s) => ({ id: `cs-${s.id}`, label: s.label }))
  const active = useSectionSpy(sections.map((s) => s.id))
  const showsLinks = study.sections.some((s) => s.body.some((b) => b.links))

  // focus starts on the case study's heading (the page opens at its top)
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true })
  }, [])

  function jump(e, sectionId) {
    e.preventDefault()
    document.getElementById(sectionId)?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' })
  }

  const next = caseStudies[(caseStudies.indexOf(study) + 1) % caseStudies.length]
  const details = [role, when, tools.join(', ')].filter(Boolean)

  return (
    <article className="page-content case-study" aria-labelledby="cs-title">
      <header className="cs-head">
        <h1 id="cs-title" ref={headingRef} tabIndex={-1}>
          {title}
          {at && ` @ ${at}`}
        </h1>
        {details.length > 0 && (
          <p className="cs-details">
            {details.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </p>
        )}
      </header>

      <nav className="cs-nav" aria-label={`${title}: sections`}>
        <Link to="/#case-studies" className="cs-back">
          <span aria-hidden="true">←</span> Case studies
        </Link>
        <ol>
          {sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} aria-current={active === s.id ? 'true' : undefined} onClick={(e) => jump(e, s.id)}>
                {s.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="cs-main">
        <section className="cs-section" id={`cs-${first.id}`} aria-labelledby="cs-headline">
          <p className="cs-eyebrow mono">{first.eyebrow ?? first.label.toLowerCase()}</p>
          <div className={`cs-split ${first.image ? '' : 'is-solo'}`}>
            <div className="cs-prose">
              <h2 id="cs-headline">{headline}</h2>
              <Blocks body={first.body} links={links} />
            </div>
            {first.image && <Photo image={first.image} />}
          </div>
        </section>

        {rest.map((s) => {
          const headingId = `cs-${s.id}-title`
          return (
            <section
              key={s.id}
              className="cs-section"
              id={`cs-${s.id}`}
              aria-labelledby={s.title ? headingId : undefined}
              aria-label={s.title ? undefined : s.label}
            >
              <p className="cs-eyebrow mono">{s.eyebrow ?? s.label.toLowerCase()}</p>
              {s.title && <h2 id={headingId}>{s.title}</h2>}
              <Blocks body={s.body} links={links} />
            </section>
          )
        })}

        {!showsLinks && <ExternalLinks links={links} />}

        <p className="cs-next">
          <Link to={`/work/${next.id}`}>
            Next: {next.title} <span aria-hidden="true">→</span>
          </Link>
        </p>
      </div>
    </article>
  )
}
