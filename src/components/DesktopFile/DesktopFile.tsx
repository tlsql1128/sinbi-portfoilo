import type { CSSProperties } from 'react'
import type { DesktopFileData } from '../../types/desktop'
import FileIcon from './FileIcon'
import './DesktopFile.css'

interface DesktopFileProps {
  file: DesktopFileData
  isActive: boolean
  playIntro?: boolean
  onOpen: (id: string) => void
  onHoverChange: (id: string | null) => void
}

export default function DesktopFile({
  file,
  isActive,
  playIntro = false,
  onOpen,
  onHoverChange,
}: DesktopFileProps) {
  return (
    <button
      type="button"
      className={[
        'desktop-file',
        isActive ? 'is-active' : '',
        playIntro ? 'is-intro' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={
        {
          '--file-x': `${file.position.x}%`,
          '--file-y': `${file.position.y}%`,
          '--file-x-tablet': `${file.tabletPosition?.x ?? file.position.x}%`,
          '--file-y-tablet': `${file.tabletPosition?.y ?? file.position.y}%`,
        } as CSSProperties
      }
      onClick={() => onOpen(file.id)}
      onMouseEnter={() => onHoverChange(file.id)}
      onMouseLeave={() => onHoverChange(null)}
      onFocus={() => onHoverChange(file.id)}
      onBlur={() => onHoverChange(null)}
      aria-label={`${file.name} 열기`}
    >
      <span className="desktop-file__icon-wrap">
        <span className="desktop-file__selection" />
        <FileIcon type={file.icon} />
      </span>
      <span className="desktop-file__name">{file.name}</span>
    </button>
  )
}
