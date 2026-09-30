import { useCallback, useRef, useState } from 'react'
import kvImage from '../../assets/images/kv.png'
import { dockActions, type DockActionId } from '../../data/dockActions'
import { tools } from '../../data/tools'
import LeftRail from './LeftRail'
import WidgetStack from './WidgetStack'
import Clock from './Clock'
import PortfolioType from './PortfolioType'
import ToolDock from './ToolDock'
import ToolModal from './ToolModal'
import type { ModalOrigin } from './types'
import './HeroKV.css'

type OpenModal =
  | { kind: 'tool'; id: string }
  | { kind: 'action'; id: DockActionId }

export default function HeroKV() {
  const [open, setOpen] = useState<OpenModal | null>(null)
  const [isClosing, setIsClosing] = useState(false)
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

      <div className="hero-kv__ui">
        <LeftRail />
        <Clock />
        <WidgetStack />
        <PortfolioType />
      </div>

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

      <ToolDock
        activeId={!isClosing && open?.kind === 'tool' ? open.id : null}
        activeActionId={!isClosing && open?.kind === 'action' ? open.id : null}
        onSelect={selectTool}
        onSelectAction={selectAction}
      />
    </section>
  )
}
