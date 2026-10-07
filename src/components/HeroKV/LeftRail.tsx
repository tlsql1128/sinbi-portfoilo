import { useEffect, useRef, useState } from 'react'
import aboutme from '../../assets/images/aboutme.webp'
import cheongyeonPin from '../../assets/images/cheongyeon.webp'
import poppiPin from '../../assets/images/poppi.webp'
import projectsFolder from '../../assets/images/projects.webp'
import sentinelPin from '../../assets/images/sentinelarospace.webp'
import washfactoryPin from '../../assets/images/washfactory.webp'
import { projects } from '../../data/projects'
import './LeftRail.css'

const openAbout = () => {
  /* ABOUT ME */
}

const SHOWCASE_IDS = ['cheongyeon', 'sentinel', 'poppi', 'washfactory'] as const
const SHOWCASE_INTERVAL = 4800
const SHOWCASE_PINS: Record<(typeof SHOWCASE_IDS)[number], string> = {
  cheongyeon: cheongyeonPin,
  sentinel: sentinelPin,
  poppi: poppiPin,
  washfactory: washfactoryPin,
}
const SHOWCASE_NOTES: Record<(typeof SHOWCASE_IDS)[number], string> = {
  cheongyeon: '팀 프로젝트',
  sentinel: '웹사이트',
  poppi: '팀 프로젝트',
  washfactory: '랜딩 페이지',
}

const showcase = SHOWCASE_IDS.flatMap((id) => {
  const project = projects.find((item) => item.id === id)
  return project ? [project] : []
})

type ShowcaseId = (typeof SHOWCASE_IDS)[number]

interface LeavingSheet {
  id: ShowcaseId
  image: string
  name: string
  number: number
}

interface LeftRailProps {
  onOpenProjects: () => void
  onOpenProject: (id: string) => void
}

export default function LeftRail({ onOpenProjects, onOpenProject }: LeftRailProps) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [leavingPin, setLeavingPin] = useState<string | null>(null)
  const [leavingSheet, setLeavingSheet] = useState<LeavingSheet | null>(null)
  const current = showcase[index]
  const pinSrc = current ? SHOWCASE_PINS[current.id as ShowcaseId] : ''
  const pinSrcRef = useRef(pinSrc)
  const shownRef = useRef({ project: current, number: index + 1 })

  useEffect(() => {
    if (!pinSrc || pinSrc === pinSrcRef.current) return
    setLeavingPin(pinSrcRef.current)
    pinSrcRef.current = pinSrc
    const timer = window.setTimeout(() => setLeavingPin(null), 520)
    return () => window.clearTimeout(timer)
  }, [pinSrc])

  useEffect(() => {
    const previous = shownRef.current
    if (!current || !previous.project || previous.project.id === current.id) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      shownRef.current = { project: current, number: index + 1 }
      return
    }
    const previousId = previous.project.id as ShowcaseId
    setLeavingSheet({
      id: previousId,
      image: previous.project.image ?? '',
      name: previous.project.name,
      number: previous.number,
    })
    shownRef.current = { project: current, number: index + 1 }
    const timer = window.setTimeout(() => setLeavingSheet(null), 720)
    return () => window.clearTimeout(timer)
  }, [current, index])

  useEffect(() => {
    if (paused || showcase.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => {
      setIndex((value) => (value + 1) % showcase.length)
    }, SHOWCASE_INTERVAL)
    return () => window.clearInterval(timer)
  }, [paused])

  const openCurrent = () => {
    if (!current) return
    onOpenProject(current.id)
  }

  return (
    <aside className="kv-side" aria-label="선택된 작업">
      <div
        className="kv-snapshot-wrap"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <section className={`kv-snapshot${current ? ` is-${current.id}` : ''}`}>
          {leavingPin ? (
            <img className="kv-snapshot__pin is-leaving" src={leavingPin} alt="" draggable={false} />
          ) : null}
          {pinSrc ? <img className="kv-snapshot__pin" src={pinSrc} alt="" draggable={false} /> : null}
          {current ? (
            <button
              type="button"
              className="kv-snapshot__stage"
              onClick={openCurrent}
              aria-label={`${current.name} 프로젝트 열기`}
            >
              <span className={`kv-snapshot__slide${leavingSheet ? ' is-incoming' : ''}`}>
                {current.image ? (
                  <img className="kv-snapshot__shot" src={current.image} alt="" draggable={false} />
                ) : null}
              </span>
              {leavingSheet?.image ? (
                <span className="kv-snapshot__slide is-leaving" key={leavingSheet.id}>
                  <img className="kv-snapshot__shot" src={leavingSheet.image} alt="" draggable={false} />
                </span>
              ) : null}
            </button>
          ) : null}
          {leavingSheet ? (
            <p className={`kv-snapshot__note is-${leavingSheet.id} is-leaving`}>
              <span className="kv-snapshot__note-title">
                {String(leavingSheet.number).padStart(2, '0')}. {leavingSheet.name}
              </span>
              <span className="kv-snapshot__note-kind">{SHOWCASE_NOTES[leavingSheet.id]}</span>
            </p>
          ) : null}
          {current ? (
            <p className={`kv-snapshot__note is-${current.id}`}>
              <span className="kv-snapshot__note-title">
                {String(index + 1).padStart(2, '0')}. {current.name}
              </span>
              <span className="kv-snapshot__note-kind">
                {SHOWCASE_NOTES[current.id as ShowcaseId]}
              </span>
            </p>
          ) : null}
        </section>
      </div>

      <div className="kv-files">
        <button type="button" className="kv-file kv-file--projects" onClick={onOpenProjects}>
          <img src={projectsFolder} alt="" draggable={false} />
          <span>PROJECTS</span>
        </button>
        <button type="button" className="kv-file kv-file--about" onClick={openAbout}>
          <img src={aboutme} alt="" draggable={false} />
          <span>ABOUT ME</span>
        </button>
      </div>
    </aside>
  )
}
