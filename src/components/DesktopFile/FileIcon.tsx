import type { FileType } from '../../types/desktop'
import './FileIcon.css'

interface FileIconProps {
  type: FileType
}

export default function FileIcon({ type }: FileIconProps) {
  return (
    <span className={`file-icon file-icon--${type}`} aria-hidden="true">
      {type === 'folder' && (
        <svg viewBox="0 0 48 48" fill="none">
          <path
            d="M6 14c0-2.2 1.8-4 4-4h8.5l3 3H38c2.2 0 4 1.8 4 4v17c0 2.2-1.8 4-4 4H10c-2.2 0-4-1.8-4-4V14z"
            fill="#D4D0C8"
            stroke="#8A8680"
            strokeWidth="1.5"
          />
          <path
            d="M6 20h36v15c0 2.2-1.8 4-4 4H10c-2.2 0-4-1.8-4-4V20z"
            fill="#E8E4DC"
            stroke="#8A8680"
            strokeWidth="1.5"
          />
        </svg>
      )}

      {type === 'pdf' && (
        <svg viewBox="0 0 48 48" fill="none">
          <path
            d="M12 4h16l10 10v28c0 1.1-.9 2-2 2H12c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
            fill="#EDE9E2"
            stroke="#8A8680"
            strokeWidth="1.5"
          />
          <path d="M28 4v10h10" stroke="#8A8680" strokeWidth="1.5" fill="none" />
          <rect x="14" y="22" width="20" height="3" rx="1" fill="#B8B4AC" />
          <rect x="14" y="28" width="14" height="3" rx="1" fill="#C8C4BC" />
          <rect x="14" y="34" width="17" height="3" rx="1" fill="#C8C4BC" />
        </svg>
      )}

      {type === 'text' && (
        <svg viewBox="0 0 48 48" fill="none">
          <path
            d="M12 4h16l10 10v28c0 1.1-.9 2-2 2H12c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
            fill="#F2EEE8"
            stroke="#8A8680"
            strokeWidth="1.5"
          />
          <path d="M28 4v10h10" stroke="#8A8680" strokeWidth="1.5" fill="none" />
          <rect x="14" y="20" width="20" height="2.5" rx="1" fill="#A8A49C" />
          <rect x="14" y="26" width="18" height="2.5" rx="1" fill="#B8B4AC" />
          <rect x="14" y="32" width="16" height="2.5" rx="1" fill="#B8B4AC" />
          <rect x="14" y="38" width="12" height="2.5" rx="1" fill="#C8C4BC" />
        </svg>
      )}

      {type === 'mail' && (
        <svg viewBox="0 0 48 48" fill="none">
          <rect
            x="6"
            y="12"
            width="36"
            height="24"
            rx="3"
            fill="#E8E4DC"
            stroke="#8A8680"
            strokeWidth="1.5"
          />
          <path
            d="M8 14l16 12L40 14"
            stroke="#8A8680"
            strokeWidth="1.5"
            fill="none"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
  )
}
