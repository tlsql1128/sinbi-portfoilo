import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import type { WindowSizePreset } from '../../types/desktop'
import './Window.css'

interface WindowProps {
  title: string
  size: WindowSizePreset
  offset: { x: number; y: number }
  isClosing: boolean
  onClose: () => void
  onCloseComplete: () => void
  children: ReactNode
}

export default function Window({
  title,
  size,
  offset,
  isClosing,
  onClose,
  onCloseComplete,
  children,
}: WindowProps) {
  const windowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  useEffect(() => {
    const el = windowRef.current
    if (!el || !isClosing) return

    let done = false
    const finish = () => {
      if (done) return
      done = true
      onCloseComplete()
    }

    const onEnd = (e: AnimationEvent) => {
      if (e.target === el) finish()
    }
    el.addEventListener('animationend', onEnd)
    const fallback = window.setTimeout(finish, 320)
    return () => {
      el.removeEventListener('animationend', onEnd)
      window.clearTimeout(fallback)
    }
  }, [isClosing, onCloseComplete])

  return (
    <div
      ref={windowRef}
      className={[
        'os-window',
        `os-window--${size}`,
        isClosing ? 'is-closing' : 'is-opening',
      ].join(' ')}
      style={
        {
          '--window-offset-x': `${offset.x}px`,
          '--window-offset-y': `${offset.y}px`,
        } as CSSProperties
      }
      role="dialog"
      aria-modal="true"
      aria-labelledby="os-window-title"
      /* Extensible hook for future drag: data-draggable-root */
      data-draggable-root
    >
      <div className="os-window__titlebar" data-drag-handle>
        <div className="os-window__controls">
          <button
            type="button"
            className="os-window__control os-window__control--close"
            aria-label="창 닫기"
            onClick={onClose}
          />
          <span className="os-window__control" aria-hidden="true" />
          <span className="os-window__control" aria-hidden="true" />
        </div>
        <h2 id="os-window-title" className="os-window__title">
          {title}
        </h2>
        <div className="os-window__titlebar-spacer" aria-hidden="true" />
      </div>
      <div className="os-window__content">{children}</div>
    </div>
  )
}
