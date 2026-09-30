import aboutme from '../../assets/images/aboutme.png'
import projects from '../../assets/images/projects.png'
import './LeftRail.css'

const openProjects = () => {
  /* PROJECTS */
}

const openAbout = () => {
  /* ABOUT ME */
}

export default function LeftRail() {
  return (
    <aside className="kv-side" aria-label="선택된 작업">
      <section className="kv-snapshot">
        <div className="kv-snapshot__media">
          {/* DESIGN SNAPSHOT IMAGE */}
        </div>

        <div className="kv-snapshot__top">
          <div>
            <p className="kv-snapshot__kicker">DESIGN</p>
            <h2 className="kv-snapshot__title">SNAPSHOT</h2>
            <p className="kv-snapshot__meta">Selected works · 2026</p>
          </div>
          <span className="kv-snapshot__arrow" aria-hidden="true">
            ↗
          </span>
        </div>

        <p className="kv-snapshot__count">01 / 04</p>
      </section>

      <div className="kv-files">
        <button type="button" className="kv-file kv-file--projects" onClick={openProjects}>
          <img src={projects} alt="" draggable={false} />
          <span>PROJECTS</span>
        </button>
        <button type="button" className="kv-file kv-file--about" onClick={openAbout}>
          <img src={aboutme} alt="" draggable={false} />
          <span>ABOUT ME</span>
        </button>
      </div>
    </aside>
  )
}
