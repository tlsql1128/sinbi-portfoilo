import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import projectsFolderImage from '../../assets/images/projects.webp'
import {
  projectCategories,
  projects,
  type Project,
  type ProjectFilter,
} from '../../data/projects'
import ProjectDetailView from './ProjectDetail'
import './ProjectsWindow.css'

function projectCategoryLine(project: Project) {
  const label = projectCategories.find((item) => item.id === project.category)?.meta ?? ''
  return `${label} · UI/UX`
}

type ViewMode = 'grid' | 'list'

interface ProjectsWindowProps {
  isClosing: boolean
  initialProjectId?: string | null
  requestedProjectId?: string | null
  requestedProjectToken?: number
  onClose: () => void
  onCloseComplete: () => void
}

function FolderGlyph() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M2.2 4.4c0-.7.5-1.2 1.2-1.2h3l1.1 1.2h5.1c.7 0 1.2.5 1.2 1.2v6c0 .7-.5 1.2-1.2 1.2H3.4c-.7 0-1.2-.5-1.2-1.2v-7.2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function GridGlyph() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <rect x="2.2" y="2.2" width="4.6" height="4.6" rx="1" fill="currentColor" />
      <rect x="9.2" y="2.2" width="4.6" height="4.6" rx="1" fill="currentColor" />
      <rect x="2.2" y="9.2" width="4.6" height="4.6" rx="1" fill="currentColor" />
      <rect x="9.2" y="9.2" width="4.6" height="4.6" rx="1" fill="currentColor" />
    </svg>
  )
}

function ListGlyph() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M3 4.2h10M3 8h10M3 11.8h10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ArrowRight() {
  return (
    <svg className="project-featured__arrow" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="m9 6 6 6-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ArrowUpRight() {
  return (
    <svg className="project-shot__cue-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 17 17 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 7h10v10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Shot({ project }: { project: Project }) {
  return (
    <div className={`project-shot${project.image ? ' has-image' : ''}`}>
      {project.image ? (
        <img src={project.image} alt="" draggable={false} />
      ) : (
        <>
          <span className="project-shot__label">IMAGE</span>
          <span className="project-shot__number">{project.number}</span>
        </>
      )}
      <span className="project-shot__cue" aria-hidden="true">
        <ArrowUpRight />
      </span>
    </div>
  )
}

function projectPath(id: string) {
  return `/projects/${id}`
}

export default function ProjectsWindow({
  isClosing,
  initialProjectId = null,
  requestedProjectId = null,
  requestedProjectToken = 0,
  onClose,
  onCloseComplete,
}: ProjectsWindowProps) {
  const [category, setCategory] = useState<ProjectFilter>('all')
  const [query, setQuery] = useState('')
  const [view, setView] = useState<ViewMode>('grid')
  const [selectedId, setSelectedId] = useState<string | null>(initialProjectId)
  const mainRef = useRef<HTMLDivElement>(null)
  const listScrollRef = useRef(0)

  useEffect(() => {
    if (!requestedProjectToken || !requestedProjectId) return
    setSelectedId(requestedProjectId)
  }, [requestedProjectId, requestedProjectToken])

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    const matched = projects.filter((project) => {
      const inCategory = category === 'all' || project.category === category
      if (!inCategory) return false
      if (!keyword) return true
      return [project.name, project.disciplines, project.description, project.category, ...(project.tags ?? [])]
        .join(' ')
        .toLowerCase()
        .includes(keyword)
    })
    if (category !== 'all') return matched
    return [
      ...matched.filter((project) => project.category !== 'detail'),
      ...matched.filter((project) => project.category === 'detail'),
    ]
  }, [category, query])

  const featured = category === 'all' && view === 'grid' ? filtered.find((project) => project.featured) ?? null : null
  const listed = featured ? filtered.filter((project) => project.id !== featured.id) : filtered

  const selected = projects.find((project) => project.id === selectedId) ?? null
  const catalogIndex = selected ? projects.findIndex((project) => project.id === selected.id) : -1
  const previousProject = catalogIndex > 0 ? projects[catalogIndex - 1] : null
  const nextProject = catalogIndex >= 0 && catalogIndex < projects.length - 1 ? projects[catalogIndex + 1] : null

  const requestClose = useCallback(() => {
    if (window.location.pathname.startsWith('/projects')) {
      window.history.pushState({}, '', '/')
    }
    onClose()
  }, [onClose])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') requestClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [requestClose])

  useEffect(() => {
    const onPop = () => {
      const match = window.location.pathname.match(/^\/projects\/([^/]+)\/?$/)
      const id = match ? decodeURIComponent(match[1]) : null
      setSelectedId(id && projects.some((project) => project.id === id) ? id : null)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    if (!isClosing) return
    const timer = window.setTimeout(onCloseComplete, 360)
    return () => window.clearTimeout(timer)
  }, [isClosing, onCloseComplete])

  useEffect(() => {
    const main = mainRef.current
    if (!main) return
    main.scrollTop = selectedId ? 0 : listScrollRef.current
  }, [selectedId])

  const openProject = (id: string) => {
    if (!selectedId && mainRef.current) listScrollRef.current = mainRef.current.scrollTop
    setSelectedId(id)
    const nextPath = projectPath(id)
    if (window.location.pathname !== nextPath) {
      window.history.pushState({ projectId: id }, '', nextPath)
    }
  }

  const goBack = () => {
    setSelectedId(null)
    if (window.location.pathname.startsWith('/projects/')) {
      window.history.pushState({}, '', '/')
    }
  }

  return (
    <div className="projects-window">
      <div className={`projects-window__overlay${isClosing ? ' is-closing' : ''}`} />
      <div
        className={`projects-window__frame${isClosing ? ' is-closing' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Projects"
        onAnimationEnd={(event) => {
          if (event.target !== event.currentTarget) return
          if (event.animationName === 'projects-window-out') onCloseComplete()
        }}
      >
        <header className="projects-window__toolbar">
          <div className="projects-window__toolbar-nav">
            <div className="projects-window__lights">
              <button type="button" className="projects-window__light is-red" aria-label="닫기" onClick={requestClose} />
              <button
                type="button"
                className="projects-window__light is-yellow"
                aria-label="이전 페이지"
                disabled={!previousProject}
                onClick={() => {
                  if (previousProject) openProject(previousProject.id)
                }}
              />
              <button
                type="button"
                className="projects-window__light is-green"
                aria-label="다음 페이지"
                disabled={!nextProject}
                onClick={() => {
                  if (nextProject) openProject(nextProject.id)
                }}
              />
            </div>
          </div>
          <div className="projects-window__toolbar-title">
            <p className="projects-window__crumb">
              <FolderGlyph />
              <span>PROJECTS</span>
            </p>
          </div>

          <div className="projects-window__tools">
            <label className="projects-window__search">
              <span className="sr-only">프로젝트 검색</span>
              <input
                type="search"
                value={query}
                placeholder="Search projects..."
                onChange={(event) => {
                  setQuery(event.target.value)
                  setSelectedId(null)
                  if (window.location.pathname.startsWith('/projects/')) {
                    window.history.pushState({}, '', '/')
                  }
                }}
              />
            </label>
            <div className="projects-window__views" role="group" aria-label="보기 방식">
              <button
                type="button"
                className={view === 'grid' ? 'is-active' : ''}
                aria-label="격자 보기"
                aria-pressed={view === 'grid'}
                onClick={() => setView('grid')}
              >
                <GridGlyph />
              </button>
              <button
                type="button"
                className={view === 'list' ? 'is-active' : ''}
                aria-label="목록 보기"
                aria-pressed={view === 'list'}
                onClick={() => setView('list')}
              >
                <ListGlyph />
              </button>
            </div>
          </div>
        </header>

        <div className="projects-window__body">
          <aside className="projects-window__sidebar">
            <div className="projects-folder-preview">
              {projectsFolderImage ? (
                <img src={projectsFolderImage} alt="Projects folder" draggable={false} />
              ) : null}
            </div>
            <h2 className="projects-window__side-title">PROJECTS</h2>
            <p className="projects-window__side-copy">Selected works</p>
            <ul className="projects-window__categories">
              {projectCategories.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={category === item.id ? 'is-active' : ''}
                    onClick={() => {
                      setCategory(item.id)
                      setSelectedId(null)
                    }}
                  >
                    <FolderGlyph />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <div className="projects-window__main" ref={mainRef}>
            {selected ? (
              <ProjectDetailView
                project={selected}
                previous={previousProject}
                next={nextProject}
                onBack={goBack}
                onOpen={openProject}
              />
            ) : (
                <div key={category} className="projects-window__results">
                {filtered.length === 0 ? (
                  <p className="projects-window__empty">표시할 프로젝트가 없습니다.</p>
                ) : view === 'list' ? (
                  <div className="project-list">
                    {filtered.map((project) => (
                      <article
                        key={project.id}
                        className="project-list__row"
                        role="link"
                        tabIndex={0}
                        aria-label={`${project.name} 열기`}
                        onClick={() => openProject(project.id)}
                        onKeyDown={(event) => {
                          if (event.key !== 'Enter' && event.key !== ' ') return
                          event.preventDefault()
                          openProject(project.id)
                        }}
                      >
                        <Shot project={project} />
                        <div>
                          <h3>{project.name}</h3>
                          <p className="project-meta">
                            <span>{projectCategoryLine(project)}</span>
                            <span>{project.year}</span>
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <>
                    {featured ? (
                      <section className="project-featured">
                        <p className="project-featured__eyebrow">FEATURED PROJECT</p>
                        <article
                          className="project-featured__card"
                          role="link"
                          tabIndex={0}
                          aria-label={`${featured.name} 열기`}
                          onClick={() => openProject(featured.id)}
                          onKeyDown={(event) => {
                            if (event.key !== 'Enter' && event.key !== ' ') return
                            event.preventDefault()
                            openProject(featured.id)
                          }}
                        >
                          <div className="project-featured__visual">
                            {featured.image ? (
                              <img src={featured.image} alt="" draggable={false} />
                            ) : null}
                          </div>
                          <div className="project-featured__info">
                            <h3>{featured.name}</h3>
                            <p className="project-meta">
                              <span>{projectCategoryLine(featured)}</span>
                              <span>{featured.year}</span>
                            </p>
                            {featured.featuredDescription || featured.description ? (
                              <p className="project-featured__copy">
                                {featured.featuredDescription || featured.description}
                              </p>
                            ) : null}
                            <span className="project-featured__action">
                              VIEW PROJECT
                              <span className="project-featured__line" />
                              <ArrowRight />
                            </span>
                          </div>
                        </article>
                      </section>
                    ) : null}
                    {listed.length > 0 ? (
                      <div className="project-grid">
                        {listed.map((project) => (
                          <article
                            key={project.id}
                            className="project-card"
                            role="link"
                            tabIndex={0}
                            aria-label={`${project.name} 열기`}
                            onClick={() => openProject(project.id)}
                            onKeyDown={(event) => {
                              if (event.key !== 'Enter' && event.key !== ' ') return
                              event.preventDefault()
                              openProject(project.id)
                            }}
                          >
                            <Shot project={project} />
                            <h3>{project.name}</h3>
                            <p className="project-meta">
                              <span>{projectCategoryLine(project)}</span>
                              <span>{project.year}</span>
                            </p>
                          </article>
                        ))}
                      </div>
                    ) : null}
                  </>
                )}
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
