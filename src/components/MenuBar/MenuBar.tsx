import { useEffect, useState } from 'react'
import './MenuBar.css'

const MENU_ITEMS = ['파일', '보기', '이동'] as const

function formatTime(date: Date) {
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

export default function MenuBar() {
  const [time, setTime] = useState(() => formatTime(new Date()))

  useEffect(() => {
    const tick = () => setTime(formatTime(new Date()))
    tick()
    const id = window.setInterval(tick, 30_000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <header className="menu-bar" role="banner">
      <div className="menu-bar__left">
        <span className="menu-bar__brand">PORTFOLIO</span>
        <nav className="menu-bar__nav" aria-label="메뉴">
          {MENU_ITEMS.map((item) => (
            <button key={item} type="button" className="menu-bar__item">
              {item}
            </button>
          ))}
        </nav>
      </div>
      <div className="menu-bar__right">
        <span className="menu-bar__year">2026</span>
        <span className="menu-bar__time" aria-live="polite">
          {time}
        </span>
      </div>
    </header>
  )
}
