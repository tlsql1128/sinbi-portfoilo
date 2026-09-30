import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import type { ToolItem } from '../../data/tools'
import type { DockAction } from '../../data/dockActions'
import type { ModalOrigin } from './types'
import './ToolModal.css'

interface ToolModalProps {
  origin: ModalOrigin
  isClosing: boolean
  onClose: () => void
  onCloseComplete: () => void
  tool?: ToolItem
  action?: DockAction
  onPrev?: () => void
  onNext?: () => void
}

function ContactBody({ action }: { action: Extract<DockAction, { id: 'contact' }> }) {
  const phone = action.phone.trim()
  const email = action.email.trim()

  return (
    <>
      <header className="tool-modal__header">
        <img className="tool-modal__icon" src={action.icon} alt="" draggable={false} />
        <div className="tool-modal__heading">
          <h2 id="tool-modal-title" className="tool-modal__name">
            {action.title}
          </h2>
        </div>
      </header>

      <p className="tool-modal__description">{action.description}</p>

      <div className="tool-modal__used">
        <p className="tool-modal__used-label">CONTACT</p>
        <div className="tool-modal__rows">
          <ContactRow label="PHONE" value={phone} placeholder="010-0000-0000" />
          <ContactRow label="EMAIL" value={email} placeholder="example@email.com" />
          <div className="tool-modal__kakao">
            <div className="tool-modal__kakao-copy">
              <span className="tool-modal__kakao-label">KAKAO</span>
              <span className="tool-modal__kakao-title">카카오톡으로 연락하기</span>
              <span className="tool-modal__kakao-hint">QR 코드를 스캔해주세요</span>
            </div>
            <img src={action.qr} alt="카카오톡 QR" draggable={false} />
          </div>
        </div>
      </div>
    </>
  )
}

function ContactRow({
  label,
  value,
  placeholder,
}: {
  label: string
  value: string
  placeholder: string
}) {
  const [copied, setCopied] = useState(false)

  const copyValue = async () => {
    if (!value) return
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      const area = document.createElement('textarea')
      area.value = value
      area.setAttribute('readonly', '')
      area.style.position = 'fixed'
      area.style.left = '-9999px'
      document.body.appendChild(area)
      area.select()
      document.execCommand('copy')
      document.body.removeChild(area)
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  const content = (
    <>
      <span className="tool-modal__row-label">{label}</span>
      <span className={`tool-modal__row-value${value ? '' : ' is-placeholder'}`}>
        {copied ? '복사됨' : value || placeholder}
      </span>
    </>
  )

  if (!value) {
    return <div className="tool-modal__row">{content}</div>
  }

  return (
    <button type="button" className="tool-modal__row is-link" onClick={copyValue}>
      {content}
    </button>
  )
}

function ResumeBody({ action }: { action: Extract<DockAction, { id: 'resume' }> }) {
  const file = (
    <>
      <span className="tool-modal__file-copy">
        <span className="tool-modal__file-label">PDF</span>
        <span className="tool-modal__file-name">{action.fileName}</span>
      </span>
      <span className="tool-modal__file-open" aria-hidden="true">
        ↗
      </span>
    </>
  )

  return (
    <>
      <header className="tool-modal__header">
        <img className="tool-modal__icon" src={action.icon} alt="" draggable={false} />
        <div className="tool-modal__heading">
          <h2 id="tool-modal-title" className="tool-modal__name">
            {action.title}
          </h2>
        </div>
      </header>

      <p className="tool-modal__description">{action.description}</p>

      <div className="tool-modal__used">
        <p className="tool-modal__used-label">RESUME FILE</p>
        {action.resumeUrl ? (
          <a
            className="tool-modal__file is-link"
            href={action.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {file}
          </a>
        ) : (
          <div className="tool-modal__file">{file}</div>
        )}
      </div>
    </>
  )
}

function ToolBody({ tool }: { tool: ToolItem }) {
  return (
    <>
      <header className="tool-modal__header">
        <img className="tool-modal__icon" src={tool.icon} alt="" draggable={false} />
        <div className="tool-modal__heading">
          <h2 id="tool-modal-title" className="tool-modal__name">
            {tool.name}
          </h2>
          <p className="tool-modal__category">{tool.category}</p>
        </div>
      </header>

      <p className="tool-modal__description">{tool.description}</p>

      <div className="tool-modal__used">
        <p className="tool-modal__used-label">USED FOR</p>
        <ul className="tool-modal__tags">
          {tool.tags.map((tag) => (
            <li key={tag} className="tool-modal__tag">
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default function ToolModal({
  origin,
  isClosing,
  onClose,
  onCloseComplete,
  tool,
  action,
  onPrev,
  onNext,
}: ToolModalProps) {
  const windowRef = useRef<HTMLDivElement>(null)
  const [from, setFrom] = useState({ x: 0, y: 0 })
  const [ready, setReady] = useState(false)
  const [visible, setVisible] = useState(false)
  const contentKey = tool?.id ?? action?.id ?? 'modal'

  useLayoutEffect(() => {
    const el = windowRef.current
    if (!el) return

    const parent = el.offsetParent as HTMLElement | null
    const parentRect = parent?.getBoundingClientRect()
    const centerX = (parentRect?.left ?? 0) + el.offsetLeft + el.offsetWidth / 2
    const centerY = (parentRect?.top ?? 0) + el.offsetTop + el.offsetHeight / 2

    setFrom({
      x: origin.x - centerX,
      y: origin.y - centerY,
    })
    setReady(true)
  }, [origin.x, origin.y])

  useEffect(() => {
    if (!ready) return
    const id = window.requestAnimationFrame(() => setVisible(true))
    return () => window.cancelAnimationFrame(id)
  }, [ready])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
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

    const onEnd = (event: AnimationEvent) => {
      if (event.target === el && event.animationName === 'tool-modal-out') finish()
    }

    el.addEventListener('animationend', onEnd)
    const fallback = window.setTimeout(finish, 680)
    return () => {
      el.removeEventListener('animationend', onEnd)
      window.clearTimeout(fallback)
    }
  }, [isClosing, onCloseComplete])

  let body: ReactNode = null
  if (tool) body = <ToolBody tool={tool} />
  else if (action?.id === 'contact') body = <ContactBody action={action} />
  else if (action?.id === 'resume') body = <ResumeBody action={action} />

  return (
    <div
      className={[
        'tool-modal',
        visible && !isClosing ? 'is-open' : '',
        isClosing ? 'is-closing' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="tool-modal__backdrop" aria-hidden="true" />

      <div
        ref={windowRef}
        className="tool-modal__window"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tool-modal-title"
        style={
          {
            '--from-x': `${from.x}px`,
            '--from-y': `${from.y}px`,
          } as CSSProperties
        }
      >
        <div className="tool-modal__controls">
          <button
            type="button"
            className="tool-modal__control tool-modal__control--close"
            aria-label="닫기"
            onClick={onClose}
          />
          {onPrev && onNext ? (
            <>
              <button
                type="button"
                className="tool-modal__control tool-modal__control--prev"
                aria-label="이전 툴"
                onClick={onPrev}
              />
              <button
                type="button"
                className="tool-modal__control tool-modal__control--next"
                aria-label="다음 툴"
                onClick={onNext}
              />
            </>
          ) : (
            <>
              <span className="tool-modal__control tool-modal__control--prev" />
              <span className="tool-modal__control tool-modal__control--next" />
            </>
          )}
        </div>

        <div key={contentKey} className="tool-modal__content">
          {body}
        </div>
      </div>
    </div>
  )
}
