export default function About() {
  return (
    <section className="page-content">
      <p className="section-label mono">about</p>
      <div className="about-body">
        <p>
          I study computer science and statistics at Duke, and spend most of
          my research time in genomics — right now that means building
          databases and web tools for fungal and yeast pangenomes.
        </p>
        <p>
          Outside of the lab I play guitar and mess around with production,
          and I play ultimate frisbee competitively. More going here soon.
        </p>
      </div>
      <div className="about-list">
        <div>
          <span>Based in</span> — Durham, NC
        </div>
        <div>
          <span>School</span> — Duke University
        </div>
        <div>
          <span>Studying</span> — Computer Science, Statistics
        </div>
      </div>
    </section>
  )
}
