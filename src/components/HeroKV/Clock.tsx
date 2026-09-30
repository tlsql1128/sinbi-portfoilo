import { useEffect, useState } from 'react'
import './Clock.css'

function pad(n: number) {
  return String(n).padStart(2, '0')
}

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const

function formatTime(date: Date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function formatDate(date: Date) {
  return `${date.getFullYear()}. ${pad(date.getMonth() + 1)}. ${pad(date.getDate())}  ${WEEKDAYS[date.getDay()]}`
}

export default function Clock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const tick = () => setNow(new Date())
    tick()

    const msToNextMinute =
      60_000 - (Date.now() % 60_000) + 50
    let intervalId = 0

    const timeoutId = window.setTimeout(() => {
      tick()
      intervalId = window.setInterval(tick, 60_000)
    }, msToNextMinute)

    return () => {
      window.clearTimeout(timeoutId)
      if (intervalId) window.clearInterval(intervalId)
    }
  }, [])

  return (
    <div className="kv-clock">
      <time className="kv-clock__time" dateTime={now.toISOString()}>
        {formatTime(now)}
      </time>
      <p className="kv-clock__date">{formatDate(now)}</p>
    </div>
  )
}
