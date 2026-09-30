import './windows.css'

const SECTIONS = ['PROFILE', 'EDUCATION', 'EXPERIENCE', 'SKILLS'] as const

export default function AboutWindow() {
  return (
    <div className="win-about">
      <div className="win-about__grid">
        {SECTIONS.map((section) => (
          <section key={section} className="win-about__block">
            <h3 className="win-about__label">{section}</h3>
            <div className="win-about__placeholder placeholder-block" />
          </section>
        ))}
      </div>
    </div>
  )
}
