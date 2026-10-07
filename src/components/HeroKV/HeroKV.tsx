import { useCallback, useEffect, useRef, useState } from 'react'
import kvImage from '../../assets/images/kv.png'
import { dockActions, type DockActionId } from '../../data/dockActions'
import { projectIdFromPath } from '../../data/projects'
import { tools } from '../../data/tools'
import LeftRail from './LeftRail'
import WidgetStack from './WidgetStack'
import Clock from './Clock'
import PortfolioType from './PortfolioType'
import ProjectsWindow from './ProjectsWindow'
import ToolDock from './ToolDock'
import ToolModal from './ToolModal'
import type { ModalOrigin } from './types'
import './HeroKV.css'

type OpenModal =
  | { kind: 'tool'; id: string }
  | { kind: 'action'; id: DockActionId }

function usePathname() {
  const [pathname, setPathname] = useState(() => window.location.pathname)

  useEffect(() => {
    const sync = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', sync)

    const { pushState, replaceState } = window.history
    window.history.pushState = function (...args: Parameters<History['pushState']>) {
      pushState.apply(this, args)
      sync()
    }
    window.history.replaceState = function (...args: Parameters<History['replaceState']>) {
      replaceState.apply(this, args)
      sync()
    }

    return () => {
      window.removeEventListener('popstate', sync)
      window.history.pushState = pushState
      window.history.replaceState = replaceState
    }
  }, [])

  return pathname
}

export default function HeroKV() {
  const [open, setOpen] = useState<OpenModal | null>(null)
  const [isClosing, setIsClosing] = useState(false)
  const pathname = usePathname()
  const projectDetailId = projectIdFromPath(pathname)
  const isProjectDetail = projectDetailId !== null
  const [projectsOpen, setProjectsOpen] = useState(() => projectIdFromPath(window.location.pathname) !== null)
  const [launchProjectId, setLaunchProjectId] = useState<string | null>(null)
  const [launchProjectToken, setLaunchProjectToken] = useState(0)
  const initialProjectId = projectIdFromPath(window.location.pathname)
  const [projectsClosing, setProjectsClosing] = useState(false)
  const [origin, setOrigin] = useState<ModalOrigin | null>(null)
  const openRef = useRef<string | null>(null)

  const selectedTool =
    open?.kind === 'tool' ? (tools.find((tool) => tool.id === open.id) ?? null) : null
  const selectedAction = open?.kind === 'action' ? dockActions[open.id] : null

  const openFrom = useCallback((id: string, nextOrigin: ModalOrigin, next: OpenModal) => {
    if (openRef.current === null) setOrigin(nextOrigin)
    openRef.current = id
    setIsClosing(false)
    setOpen(next)
  }, [])

  const selectTool = useCallback(
    (id: string, nextOrigin: ModalOrigin) => {
      openFrom(id, nextOrigin, { kind: 'tool', id })
    },
    [openFrom],
  )

  const selectAction = useCallback(
    (id: DockActionId, nextOrigin: ModalOrigin) => {
      openFrom(id, nextOrigin, { kind: 'action', id })
    },
    [openFrom],
  )

  const stepTool = useCallback((direction: -1 | 1) => {
    const sequence: OpenModal[] = [
      ...tools.map((tool) => ({ kind: 'tool' as const, id: tool.id })),
      { kind: 'action', id: 'contact' },
      { kind: 'action', id: 'resume' },
    ]

    setOpen((current) => {
      if (!current) return current
      const index = sequence.findIndex(
        (item) => item.kind === current.kind && item.id === current.id,
      )
      if (index < 0) return current
      const next = sequence[(index + direction + sequence.length) % sequence.length]
      openRef.current = next.id
      return next
    })
  }, [])

  const requestClose = useCallback(() => {
    setIsClosing(true)
  }, [])

  const completeClose = useCallback(() => {
    openRef.current = null
    setOpen(null)
    setIsClosing(false)
    setOrigin(null)
  }, [])

  return (
    <section className="hero-kv" aria-label="Key Visual">
      <div className="hero-kv__bg" aria-hidden="true">
        <img
          src={kvImage}
          alt=""
          className="hero-kv__bg-img"
          draggable={false}
        />
      </div>

      {isProjectDetail ? null : (
        <div className="hero-kv__ui">
          <LeftRail
            onOpenProjects={() => {
              setProjectsClosing(false)
              setProjectsOpen(true)
            }}
            onOpenProject={(id) => {
              setProjectsClosing(false)
              setLaunchProjectId(id)
              setLaunchProjectToken((token) => token + 1)
              setProjectsOpen(true)
              const nextPath = `/projects/${id}`
              if (window.location.pathname !== nextPath) {
                window.history.pushState({ projectId: id }, '', nextPath)
              }
            }}
          />
          <Clock />
          <WidgetStack />
          <PortfolioType />
        </div>
      )}

      {(selectedTool || selectedAction) && origin && (
        <ToolModal
          origin={origin}
          isClosing={isClosing}
          onClose={requestClose}
          onCloseComplete={completeClose}
          tool={selectedTool ?? undefined}
          action={selectedAction ?? undefined}
          onPrev={() => stepTool(-1)}
          onNext={() => stepTool(1)}
        />
      )}

      {projectsOpen ? (
        <ProjectsWindow
          isClosing={projectsClosing}
          initialProjectId={launchProjectId ?? initialProjectId}
          requestedProjectId={launchProjectId}
          requestedProjectToken={launchProjectToken}
          onClose={() => setProjectsClosing(true)}
          onCloseComplete={() => {
            setProjectsOpen(false)
            setProjectsClosing(false)
          }}
        />
      ) : null}

      {isProjectDetail ? null : (
        <ToolDock
          activeId={!isClosing && open?.kind === 'tool' ? open.id : null}
          activeActionId={!isClosing && open?.kind === 'action' ? open.id : null}
          onSelect={selectTool}
          onSelectAction={selectAction}
        />
      )}
    </section>
  )
}
