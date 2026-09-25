export default function Home() {
  return (
    <section className="page-content">
      <h1 className="home-title">
        Bioinformatics,
        <br />
        built by hand.
      </h1>
      <p className="home-role">
        CS + Statistics at Duke. I build genomics tools, small web apps, and
        the occasional model that has no business working as well as it
        does. Currently mapping yeast pangenomes and building databases for
        fungal genetics.
      </p>
      <div className="home-links">
        <a href="mailto:colin.zeng@duke.edu">email</a>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer">
          github
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
          linkedin
        </a>
      </div>
    </section>
  )
}
