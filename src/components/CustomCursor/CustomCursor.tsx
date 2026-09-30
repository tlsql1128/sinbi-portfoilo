import { useEffect, useState } from 'react'
import './CustomCursor.css'

interface CustomCursorProps {
  visible: boolean
  enabled: boolean
}

export default function CustomCursor({ visible, enabled }: CustomCursorProps) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!enabled) return

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY })
      setReady(true)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [enabled])

  if (!enabled || !ready) return null

  return (
    <div
      className={`custom-cursor ${visible ? 'is-visible' : ''}`}
      style={{
        transform: `translate3d(${pos.x + 14}px, ${pos.y + 14}px, 0)`,
      }}
      aria-hidden="true"
    >
      <span className="custom-cursor__label">OPEN ↗</span>
    </div>
  )
}
