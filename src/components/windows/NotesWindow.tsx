import './windows.css'

const LINES = [
  '디자인 기록',
  '────────────',
  '',
  '2026.03 — 포트폴리오 구조 스케치',
  '데스크톱 메타포로 탐색 UX 실험.',
  '',
  '2026.02 — 타이포그래피 리서치',
  '본문 가독성과 디스플레이 대비 검토.',
  '',
  '2026.01 — 컬러 / 머티리얼 노트',
  'neutral base 위에서 포인트 컬러 최소화.',
]

export default function NotesWindow() {
  return (
    <div className="win-notes">
      <div className="win-notes__editor">
        {LINES.map((line, i) => (
          <p key={i} className={`win-notes__line ${line === '' ? 'is-empty' : ''}`}>
            {line || '\u00A0'}
          </p>
        ))}
        <span className="win-notes__caret" aria-hidden="true" />
      </div>
    </div>
  )
}
