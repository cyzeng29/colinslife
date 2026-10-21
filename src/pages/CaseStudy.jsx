import { useEffect, useRef } from 'react'
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
      {image.caption && <figcaption>{image.caption}</figcaption>}
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

// One case study, opened from its card: a sticky list of sections beside the
// story (context, solution, process, results, and a reflection once one is
// written in caseStudies.js).
export default function CaseStudy() {
  const { id } = useParams()
  const study = findCaseStudy(id)
  if (!study) return <Navigate to="/#case-studies" replace />
  return <CaseStudyPage key={study.id} study={study} />
}

function CaseStudyPage({ study }) {
  const { title, headline, context, contextImage, solution, process, results, reflection, role, org, when, tools, links } = study
  const headingRef = useRef(null)
  usePianoHeight() // --piano-h, so jumps land just under the sticky piano

  const sections = [
    ['context', 'Context'],
    ['solution', 'Solution'],
    ['process', 'Process'],
    ...(results.length ? [['results', 'Results']] : []),
    ...(reflection ? [['reflection', 'Reflection']] : []),
  ].map(([key, label]) => ({ id: `cs-${key}`, label }))
  const active = useSectionSpy(sections.map((s) => s.id))

  // focus starts on the case study's heading (the page opens at its top)
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true })
  }, [])

  function jump(e, sectionId) {
    e.preventDefault()
    document.getElementById(sectionId)?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' })
  }

  const next = caseStudies[(caseStudies.indexOf(study) + 1) % caseStudies.length]
  const facts = [
    ['Role', role],
    ['Where', org],
    ['When', when],
    ['Tools', tools.join(' · ')],
  ].filter(([, v]) => v)

  return (
    <article className="page-content case-study" aria-labelledby="cs-title">
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
        <section className="cs-section" id="cs-context" aria-labelledby="cs-title">
          <p className="cs-eyebrow mono">{title} · context &amp; overview</p>
          <div className={`cs-split ${contextImage ? '' : 'is-solo'}`}>
            <div className="cs-prose">
              <h1 id="cs-title" ref={headingRef} tabIndex={-1}>
                {headline}
              </h1>
              {context.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <dl className="cs-facts">
                {facts.map(([k, v]) => (
                  <div key={k}>
                    <dt className="mono">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            {contextImage && <Photo image={contextImage} />}
          </div>
        </section>

        <section className="cs-section" id="cs-solution" aria-labelledby="cs-solution-title">
          <p className="cs-eyebrow mono">solution</p>
          <h2 id="cs-solution-title">{solution.title}</h2>
          <div className="cs-solution">
            <Photo image={solution.image} />
            <div className="cs-challenges">
              <h3>Key challenges</h3>
              <ol>
                {solution.challenges.map(([name, line]) => (
                  <li key={name}>
                    <em>{name}</em>
                    <span>{line}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div className="cs-prose">
            <p>{solution.text}</p>
          </div>
        </section>

        <section className="cs-section" id="cs-process" aria-labelledby="cs-process-title">
          <p className="cs-eyebrow mono">process</p>
          <h2 id="cs-process-title">How it came together</h2>
          <ol className="cs-steps">
            {process.map(([step, line]) => (
              <li key={step}>
                <h3>{step}</h3>
                <p>{line}</p>
              </li>
            ))}
          </ol>
        </section>

        {results.length > 0 && (
          <section className="cs-section" id="cs-results" aria-labelledby="cs-results-title">
            <p className="cs-eyebrow mono">impact</p>
            <h2 id="cs-results-title">Results</h2>
            <ul className="cs-results">
              {results.map(([figure, label]) => (
                <li key={label}>
                  <strong>{figure}</strong>
                  <span>{label}</span>
                </li>
              ))}
            </ul>
            <ExternalLinks links={links} />
          </section>
        )}

        {reflection && (
          <section className="cs-section" id="cs-reflection" aria-labelledby="cs-reflection-title">
            <p className="cs-eyebrow mono">reflection</p>
            <h2 id="cs-reflection-title">Looking back</h2>
            <div className="cs-prose">
              <p>{reflection}</p>
            </div>
          </section>
        )}

        {results.length === 0 && <ExternalLinks links={links} />}

        <p className="cs-next">
          <Link to={`/work/${next.id}`}>
            Next: {next.title} <span aria-hidden="true">→</span>
          </Link>
        </p>
      </div>
    </article>
  )
}
