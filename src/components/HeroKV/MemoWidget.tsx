import './Widgets.css'

const MEMOS = [
  { text: '포트폴리오 업데이트', done: true },
  { text: '레퍼런스 서치', done: false },
  { text: 'UI 디테일 수정', done: false },
  { text: '프로젝트 정리', done: false },
]

export default function MemoWidget() {
  return (
    <section className="kv-memo" aria-label="메모">
      <div className="kv-memo__header">
        <h2 className="kv-memo__title">Today</h2>
        <span className="kv-memo__add" aria-hidden="true">
          +
        </span>
      </div>
      <ul className="kv-memo__list">
        {MEMOS.map((memo) => (
          <li key={memo.text} className="kv-memo__item">
            <span
              className={`kv-memo__check${memo.done ? ' is-done' : ''}`}
              aria-hidden="true"
            >
              {memo.done ? '✓' : ''}
            </span>
            <span className={memo.done ? 'is-done' : ''}>{memo.text}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
