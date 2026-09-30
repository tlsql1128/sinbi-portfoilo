import type { MouseEvent } from 'react'
import toolCall from '../../assets/images/tool-call.png'
import toolPdf from '../../assets/images/tool-pdf.png'
import type { DockActionId } from '../../data/dockActions'
import { tools } from '../../data/tools'
import type { ModalOrigin } from './types'
import './ToolDock.css'

interface ToolDockProps {
  activeId: string | null
  activeActionId: DockActionId | null
  onSelect: (id: string, origin: ModalOrigin) => void
  onSelectAction: (id: DockActionId, origin: ModalOrigin) => void
}

function originFrom(event: MouseEvent<HTMLButtonElement>): ModalOrigin {
  const rect = event.currentTarget.getBoundingClientRect()
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  }
}

const actions = [
  { id: 'contact' as const, label: '연락하기', icon: toolCall },
  { id: 'resume' as const, label: '이력서 보기', icon: toolPdf },
]

export default function ToolDock({
  activeId,
  activeActionId,
  onSelect,
  onSelectAction,
}: ToolDockProps) {
  return (
    <div className="tool-dock">
      <div className="dock-tools" role="list" aria-label="Tools">
        {tools.map((tool) => (
          <button
            key={tool.id}
            type="button"
            className={`tool-slot ${activeId === tool.id ? 'is-active' : ''}`}
            role="listitem"
            aria-label={`${tool.name} 정보 열기`}
            aria-pressed={activeId === tool.id}
            onClick={(event) => onSelect(tool.id, originFrom(event))}
          >
            <img src={tool.icon} alt="" draggable={false} />
          </button>
        ))}
      </div>

      <div className="dock-divider" aria-hidden="true" />

      <div className="dock-actions">
        {actions.map((action) => (
          <div key={action.id} className="dock-action-wrap">
            <button
              type="button"
              className={`dock-action ${activeActionId === action.id ? 'is-active' : ''}`}
              aria-label={action.label}
              aria-pressed={activeActionId === action.id}
              onClick={(event) => onSelectAction(action.id, originFrom(event))}
            >
              <img src={action.icon} alt="" draggable={false} />
            </button>
            <span className="dock-tip" role="tooltip">
              {action.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
