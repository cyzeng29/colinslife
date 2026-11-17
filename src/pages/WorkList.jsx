import { Link } from 'react-router-dom'
import { contact, landing, recruiter, resume } from '../data/content.js'

const external = (href) => /^https?:/.test(href)

// One role or project: where and what, when, one line, and the skills gained
function Entry({ entry }) {
  const { id, org, role, when, line, skills, caseStudy } = entry
  return (
    <li className="rc-entry" id={id}>
      <div className="rc-entry-head">
        <h3 className="rc-org">{org}</h3>
        {when && <p className="rc-when mono">{when}</p>}
      </div>
      <p className="rc-role">{role}</p>
      <p className="rc-line">{line}</p>
      <ul className="rc-skills mono" aria-label="Skills">
        {skills.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      {caseStudy && (
        <Link to={`/work/${caseStudy}`} className="rc-more mono">
          case study <span aria-hidden="true">→</span>
          <span className="sr-only">: {org}</span>
        </Link>
      )}
    </li>
  )
}

// Recruiter Mode (/work/list): the brief version of everything, one line and
// the skills gained per role and project, with the resume a click away.
export default function WorkList() {
  const links = [...(resume.available ? [{ label: 'resume', href: resume.href }] : []), ...contact]
  const groups = [
    { label: 'experience', items: recruiter.experience },
    { label: 'projects', items: recruiter.projects },
  ]

  return (
    <section className="page-content recruiter" aria-labelledby="rc-title">
      <header className="rc-head">
        <div className="rc-intro">
          <p className="rc-mode mono">recruiter mode</p>
          <h1 id="rc-title">{landing.sidebar.name}</h1>
          <p className="rc-summary">{recruiter.summary}</p>
        </div>
        <ul className="rc-links mono" aria-label="Links">
          {links.map(({ label, href }) => (
            <li key={label}>
              <a href={href} {...((external(href) || href.endsWith('.pdf')) && { target: '_blank', rel: 'noopener noreferrer' })}>
                {label} <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </header>

      {groups.map((g) => (
        <section key={g.label} className={`rc-group is-${g.label}`} aria-labelledby={`rc-${g.label}`}>
          <h2 className="rc-group-title mono" id={`rc-${g.label}`}>
            {g.label}
          </h2>
          <ol className="rc-list">
            {g.items.map((e) => (
              <Entry key={e.id} entry={e} />
            ))}
          </ol>
        </section>
      ))}
    </section>
  )
}
