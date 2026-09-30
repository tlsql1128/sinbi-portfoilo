import './windows.css'

const PROJECTS = [
  { id: '01', title: '몽땅' },
  { id: '02', title: '청연' },
  { id: '03', title: 'Sentinel Aerospace' },
]

export default function ProjectsWindow() {
  return (
    <div className="win-projects">
      <ul className="win-projects__list">
        {PROJECTS.map((project) => (
          <li key={project.id} className="win-projects__item">
            <div className="win-projects__thumb placeholder-block" />
            <div className="win-projects__meta">
              <span className="win-projects__id">PROJECT {project.id}</span>
              <span className="win-projects__title">{project.title}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
