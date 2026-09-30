import './windows.css'

export default function ResumeWindow() {
  return (
    <div className="win-resume">
      <div className="win-resume__toolbar">
        <span className="win-resume__page">1 / 2</span>
        <span className="win-resume__filename">이력서.pdf</span>
      </div>
      <div className="win-resume__viewer">
        <div className="win-resume__page-sheet">
          <div className="placeholder-block win-resume__line win-resume__line--title" />
          <div className="placeholder-block win-resume__line" />
          <div className="placeholder-block win-resume__line" />
          <div className="placeholder-block win-resume__line win-resume__line--short" />
          <div className="win-resume__spacer" />
          <div className="placeholder-block win-resume__line win-resume__line--mid" />
          <div className="placeholder-block win-resume__line" />
          <div className="placeholder-block win-resume__line win-resume__line--short" />
          <div className="win-resume__spacer" />
          <div className="placeholder-block win-resume__block" />
          <div className="placeholder-block win-resume__block" />
        </div>
      </div>
    </div>
  )
}
