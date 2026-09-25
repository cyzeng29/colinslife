export default function WorkCard({ title, org, when, bullets, tools }) {
  return (
    <div className="card">
      <div className="card-top">
        <h3 className="card-title">{title}</h3>
        {when && <span className="card-when">{when}</span>}
      </div>
      {org && <p className="card-org">{org}</p>}
      <ul>
        {bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
      {tools && <p className="card-tools">{tools}</p>}
    </div>
  )
}
