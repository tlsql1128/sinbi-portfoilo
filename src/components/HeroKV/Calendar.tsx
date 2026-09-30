import { useMemo, useState } from 'react'
import './Calendar.css'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const

function buildMonthCells(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev = new Date(year, month, 0).getDate()

  const cells: { day: number; inMonth: boolean; date: Date }[] = []

  for (let i = firstDay - 1; i >= 0; i -= 1) {
    const day = daysInPrev - i
    cells.push({
      day,
      inMonth: false,
      date: new Date(year, month - 1, day),
    })
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({
      day,
      inMonth: true,
      date: new Date(year, month, day),
    })
  }

  const trailing = (7 - (cells.length % 7)) % 7
  for (let day = 1; day <= trailing; day += 1) {
    cells.push({
      day,
      inMonth: false,
      date: new Date(year, month + 1, day),
    })
  }

  return cells
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export default function Calendar() {
  const today = useMemo(() => new Date(), [])
  const [view, setView] = useState(() => ({
    year: today.getFullYear(),
    month: today.getMonth(),
  }))

  const cells = useMemo(
    () => buildMonthCells(view.year, view.month),
    [view.year, view.month],
  )

  const goPrev = () => {
    setView((prev) => {
      const date = new Date(prev.year, prev.month - 1, 1)
      return { year: date.getFullYear(), month: date.getMonth() }
    })
  }

  const goNext = () => {
    setView((prev) => {
      const date = new Date(prev.year, prev.month + 1, 1)
      return { year: date.getFullYear(), month: date.getMonth() }
    })
  }

  return (
    <aside className="kv-calendar" aria-label="달력">
      <div className="kv-calendar__header">
        <h2 className="kv-calendar__title">
          {view.year}년 {view.month + 1}월
        </h2>
        <div className="kv-calendar__nav">
          <button
            type="button"
            className="kv-calendar__nav-btn"
            onClick={goPrev}
            aria-label="이전 달"
          >
            ‹
          </button>
          <button
            type="button"
            className="kv-calendar__nav-btn"
            onClick={goNext}
            aria-label="다음 달"
          >
            ›
          </button>
        </div>
      </div>

      <div className="kv-calendar__weekdays" aria-hidden="true">
        {WEEKDAYS.map((day) => (
          <span key={day} className="kv-calendar__weekday">
            {day}
          </span>
        ))}
      </div>

      <div className="kv-calendar__grid" role="grid">
        {cells.map((cell) => {
          const isToday = isSameDay(cell.date, today)
          return (
            <span
              key={cell.date.toISOString()}
              className={[
                'kv-calendar__day',
                cell.inMonth ? 'is-current-month' : 'is-outside',
                isToday ? 'is-today' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              role="gridcell"
              aria-current={isToday ? 'date' : undefined}
            >
              {cell.day}
            </span>
          )
        })}
      </div>
    </aside>
  )
}
