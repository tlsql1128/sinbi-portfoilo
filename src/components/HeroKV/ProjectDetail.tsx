import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { type CaseSection, type Project } from '../../data/projects'
import './ProjectDetail.css'

function pad(index: number) {
  return String(index).padStart(2, '0')
}

function ArrowLeft() {
  return (
    <svg className="case-back__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M19 12H5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m12 19-7-7 7-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BackNav({ onBack }: { onBack: () => void }) {
  const anchorRef = useRef<HTMLSpanElement>(null)
  const [floating, setFloating] = useState(false)

  useEffect(() => {
    const anchor = anchorRef.current
    if (!anchor) return
    const root = anchor.closest('.projects-window__main')
    const observer = new IntersectionObserver(
      ([entry]) => setFloating(!entry.isIntersecting),
      { root: root instanceof HTMLElement ? root : null, threshold: 0 },
    )
    observer.observe(anchor)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <span ref={anchorRef} className="case-back-sentinel" aria-hidden="true" />
      <button
        type="button"
        className={`case-back-float${floating ? ' is-visible' : ''}`}
        onClick={onBack}
        aria-hidden={!floating}
        tabIndex={floating ? 0 : -1}
      >
        <ArrowLeft />
        PROJECTS
      </button>
    </>
  )
}
function ArrowUpRight({ className = 'project-hero-mockup__live-icon' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 17 17 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 7h10v10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Placeholder({
  label = 'IMAGE PLACEHOLDER',
  src,
  ratio = '16 / 9',
}: {
  label?: string
  src?: string | null
  ratio?: string
}) {
  if (src) {
    return <img className="case-visual" src={src} alt="" draggable={false} style={{ aspectRatio: ratio }} />
  }

  return (
    <div className="case-placeholder" style={{ aspectRatio: ratio }}>
      {label}
    </div>
  )
}

function AccentLine({ text, accent }: { text: string; accent?: string }) {
  if (!accent || !text.includes(accent)) return text
  const [before, after] = text.split(accent)
  return (
    <>
      {before}
      <em>{accent}</em>
      {after}
    </>
  )
}

function AccentText({ text, accent }: { text: string; accent?: string }) {
  const lines = text.split('\n')
  return lines.map((line, index) => (
    <span key={`${index}-${line}`}>
      {index > 0 ? <br /> : null}
      <AccentLine text={line} accent={accent} />
    </span>
  ))
}

function SectionHeading({ index, title, inline = false }: { index: number; title: string; inline?: boolean }) {
  return (
    <header className={`case-section__heading${inline ? ' is-inline' : ''}`}>
      <span>{pad(index)}</span>
      <h3>{title}</h3>
    </header>
  )
}

const deviceOrder = ['desktop', 'tablet', 'mobile'] as const

function ScreenLightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const previousBody = document.body.style.overflow
    const main = document.querySelector('.projects-window__main')
    const previousMain = main instanceof HTMLElement ? main.style.overflow : ''
    document.body.style.overflow = 'hidden'
    if (main instanceof HTMLElement) main.style.overflow = 'hidden'

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      event.stopImmediatePropagation()
      onClose()
    }
    window.addEventListener('keydown', onKey, true)
    return () => {
      document.body.style.overflow = previousBody
      if (main instanceof HTMLElement) main.style.overflow = previousMain
      window.removeEventListener('keydown', onKey, true)
    }
  }, [onClose])

  return createPortal(
    <div className="case-lightbox" onClick={onClose} role="presentation">
      <button type="button" className="case-lightbox__close" aria-label="닫기" onClick={onClose}>
        ×
      </button>
      <div className="case-lightbox__frame" onClick={(event) => event.stopPropagation()}>
        <img src={src} alt={alt} draggable={false} />
      </div>
    </div>,
    document.body,
  )
}

function ScreenGallery({
  index,
  title,
  section,
}: {
  index: number
  title: string
  section: Extract<CaseSection, { type: 'screens' }>
}) {
  const [active, setActive] = useState<{ src: string; alt: string } | null>(null)
  const screens = (
    section.items ??
    (section.groups ?? []).flatMap((group, groupIndex) =>
      group.images.map((image, imageIndex) => ({
        id: `${group.label}-${groupIndex}-${imageIndex}`,
        title: group.label,
        image,
        objectPosition: undefined,
      })),
    )
  ).filter((screen) => Boolean(screen.image))
  const columns = Math.min(Math.max(screens.length, 1), 5)

  if (screens.length === 0) return null

  return (
    <section className="case-section">
      <SectionHeading inline index={index} title={title} />
      <div className="case-gallery" style={{ ['--cols' as string]: columns }}>
        {screens.map((screen, screenIndex) => (
          <article className="case-gallery__item" key={screen.id}>
            <p>
              {pad(screenIndex + 1)}. {screen.title}
            </p>
            {screen.image ? (
              <button
                type="button"
                className={`case-gallery__shot${screen.objectPosition ? ' is-slice' : ''}`}
                onClick={() => setActive({ src: screen.image!, alt: screen.title })}
              >
                <img
                  src={screen.image}
                  alt={screen.title}
                  draggable={false}
                  style={screen.objectPosition ? { objectPosition: screen.objectPosition } : undefined}
                />
              </button>
            ) : (
              <div className="case-gallery__placeholder">
                <span>SCREEN</span>
                <strong>{pad(screenIndex + 1)}</strong>
              </div>
            )}
          </article>
        ))}
      </div>
      {active ? <ScreenLightbox src={active.src} alt={active.alt} onClose={() => setActive(null)} /> : null}
    </section>
  )
}

function OverviewPanel({
  index,
  headline,
  highlight,
  description,
  features,
  stacked = false,
}: {
  index: number
  headline?: string
  highlight?: string
  description?: string
  features: { title: string; text?: string }[]
  stacked?: boolean
}) {
  const points = features.slice(0, 3)
  const columns = stacked ? 1 : Math.min(points.length, 3)

  return (
    <section className="case-section case-overview">
      <SectionHeading index={index} title="OVERVIEW" />
      {headline ? (
        <p className="case-overview__message">
          <AccentText text={headline} accent={highlight} />
        </p>
      ) : null}
      {description ? <p className="case-overview__body">{description}</p> : null}
      {points.length > 0 ? (
        <div
          className="overview-points"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {points.map((point, pointIndex) => (
            <article className="overview-card" key={point.title}>
              <h4>{point.title}</h4>
              {point.text ? <p>{point.text}</p> : null}
              <span aria-hidden="true">{pad(pointIndex + 1)}</span>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  )
}

function SectionBlock({
  index,
  section,
  summary,
}: {
  index: number
  section: CaseSection
  summary?: string
}) {
  if (section.type === 'overview') {
    return (
      <OverviewPanel
        index={index}
        headline={section.keyMessage}
        highlight={section.highlight}
        description={section.description || summary}
        features={(section.keyPoints ?? []).map((point) => ({ title: point.title, text: point.text }))}
      />
    )
  }

  if (section.type === 'challenge') {
    return (
      <section className="case-section">
        <SectionHeading index={index} title={section.title ?? 'CHALLENGE'} />
        <p className="case-lead">{section.description}</p>
        {section.items && section.items.length > 0 ? (
          <ul className="case-list">
            {section.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
      </section>
    )
  }

  if (section.type === 'goal' || section.type === 'solution') return null

  if (section.type === 'designPoint') {
    return (
      <section className="case-section">
        <SectionHeading index={index} title={section.title ?? 'DESIGN POINT'} />
        <div className="case-points-visual">
          {section.points.map((point, pointIndex) => {
            const imageRight = point.align ? point.align === 'image-right' : pointIndex % 2 === 1
            return (
              <article key={point.title} className={imageRight ? 'is-image-right' : 'is-image-left'}>
                <div>
                  <p>DESIGN POINT {pad(pointIndex + 1)}</p>
                  <h4>{point.title}</h4>
                  <p>{point.text}</p>
                </div>
                <Placeholder src={point.image} />
              </article>
            )
          })}
        </div>
      </section>
    )
  }

  if (section.type === 'designSystem') {
    const devices = deviceOrder.flatMap((key) => {
      const image = section.devices?.[key]
      if (!image) return []
      return [{ key, image }]
    })

    return (
      <section className="case-section">
        <SectionHeading inline index={index} title={section.title ?? 'DESIGN SYSTEM'} />
        <div className={`ds-board${devices.length > 0 ? ' has-devices' : ''}`}>
          <div className="ds-board__copy">
            {section.colors && section.colors.length > 0 ? (
              <div>
                <h4>COLOR</h4>
                <ul className="ds-swatches">
                  {section.colors.map((color) => (
                    <li key={color}>
                      <i className="ds-swatch" style={{ background: color }} />
                      <span>{color}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {section.typography ? (
              <div className="ds-type">
                <h4>TYPOGRAPHY</h4>
                <div>
                  <p className="ds-type__sample">Aa</p>
                  <div>
                    <p className="ds-type__family">{section.typography.family}</p>
                    {section.typography.styles.length > 0 ? (
                      <ul>
                        {section.typography.styles.map((style) => (
                          <li key={style}>{style}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          {devices.length > 0 ? (
            <div className="ds-devices" aria-label="Device mockups">
              {devices.map((device) => (
                <article key={device.key} className={`ds-device is-${device.key}`}>
                  <img src={device.image} alt={`${device.key} mockup`} draggable={false} />
                  <h5>{device.key.toUpperCase()}</h5>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    )
  }

  if (section.type === 'process') {
    return (
      <section className="case-section">
        <SectionHeading index={index} title={section.title ?? 'PROCESS'} />
        {section.style === 'steps' ? (
          <ol className="case-steps">
            {section.steps.map((step, stepIndex) => (
              <li key={step}>
                <span>{pad(stepIndex + 1)}</span>
                {step}
              </li>
            ))}
          </ol>
        ) : (
          <ol className="case-flow">
            {section.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        )}
      </section>
    )
  }

  if (section.type === 'role') {
    return (
      <section className="case-section">
        <SectionHeading index={index} title={section.title ?? 'MY ROLE'} />
        <ul className="case-role">
          {section.items.map((item) => (
            <li key={item.label}>
              <span>{item.label}</span>
              {item.value ? <em>{item.value}</em> : null}
            </li>
          ))}
        </ul>
      </section>
    )
  }

  if (section.type === 'screens') {
    return <ScreenGallery index={index} title={section.title ?? 'MAIN SCREENS'} section={section} />
  }

  if (section.type === 'responsive') return null

  return (
    <section className="case-section">
      <SectionHeading index={index} title={section.title ?? 'RESULT'} />
      {section.description ? <p className="case-lead">{section.description}</p> : null}
      {section.items && section.items.length > 0 ? (
        <ul className="case-list">
          {section.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}

function sectionRank(type: CaseSection['type']) {
  if (type === 'overview') return 0
  if (type === 'designSystem') return 1
  if (type === 'screens') return 2
  return 3
}

function orderedSections(sections: CaseSection[]) {
  return sections
    .map((section, index) => ({ section, index }))
    .filter(({ section }) => section.type !== 'goal' && section.type !== 'solution')
    .sort((a, b) => sectionRank(a.section.type) - sectionRank(b.section.type) || a.index - b.index)
    .map(({ section }) => section)
}

interface ProjectDetailProps {
  project: Project
  previous: Project | null
  next: Project | null
  onBack: () => void
  onOpen: (id: string) => void
}

function DetailPageProject({ project, previous, next, onBack, onOpen }: ProjectDetailProps) {
  const lines = project.subtitle.split('\n').map((line) => line.trim()).filter(Boolean)
  const features = project.features ?? []
  const colors = project.colors ?? []
  const zoom = (project.zoom ?? []).filter((item) => item.title || item.desc)
  const tools = project.tools ?? []
  const accent = project.accent || '#805457'
  const [previewOpen, setPreviewOpen] = useState(false)

  return (
    <article className="case-study dpp" style={{ '--dpp-accent': accent } as CSSProperties}>
      <BackNav onBack={onBack} />
      <div className="dpp-layout">
        <div className="dpp-main">
          <header className="dpp-hero">
            <div>
              <p className="dpp-eyebrow">PROJECT DETAIL</p>
              <h2>{project.name}</h2>
              {lines.length > 0 ? <p className="dpp-desc">{lines.join(' ')}</p> : null}
              {(project.tags ?? []).length > 0 ? (
                <ul className="dpp-tags">
                  {project.tags?.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              ) : null}
              <dl className="dpp-meta">
                {project.year ? (
                  <div>
                    <dt>Year</dt>
                    <dd>{project.year}</dd>
                  </div>
                ) : null}
                {project.period ? (
                  <div>
                    <dt>Period</dt>
                    <dd>{project.period}</dd>
                  </div>
                ) : null}
                {project.role && project.role.length > 0 ? (
                  <div>
                    <dt>Role</dt>
                    <dd>{project.role.join(', ')}</dd>
                  </div>
                ) : null}
              </dl>
              {tools.length > 0 ? (
                <div className="dpp-tools">
                  <p>Tools</p>
                  <ul>
                    {tools.map((tool) => (
                      <li key={tool}>{tool}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
            {project.heroMockup ? (
              <div className="dpp-mockup">
                <img src={project.heroMockup} alt={`${project.name} 모바일 목업`} draggable={false} />
              </div>
            ) : null}
          </header>

          {project.overviewHeadline || project.description || features.length > 0 ? (
            <OverviewPanel
              index={1}
              stacked
              headline={project.overviewHeadline}
              highlight={project.overviewHighlight}
              description={project.description}
              features={features.map((feature) => ({ title: feature.title, text: feature.desc }))}
            />
          ) : null}

          {project.concept || colors.length > 0 ? (
            <section className="dpp-block">
              <p className="dpp-block__num">02</p>
              <h3>DESIGN SYSTEM</h3>
              {project.concept ? <p className="dpp-block__text">{project.concept}</p> : null}
              <div className="dpp-concept">
                <div>
                  {colors.length > 0 ? (
                    <div className="dpp-concept__group">
                      <p className="dpp-label">COLOR</p>
                      <ul className="dpp-colors">
                        {colors.map((color) => (
                          <li key={color}>
                            <i style={{ background: color }} />
                            <span>{color}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  <div className="dpp-concept__group">
                    <p className="dpp-label">TYPOGRAPHY</p>
                    <div className="dpp-type">
                      <p>Aa</p>
                      <div>
                        <strong>Pretendard</strong>
                        <span>Bold</span>
                        <span>Medium</span>
                        <span>Regular</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ) : null}

          {project.detailImage ? (
            <section className="dpp-block">
              <p className="dpp-block__num">03</p>
              <h3>FULL DETAIL PAGE</h3>
              <p className="dpp-block__text">실제 상세페이지의 전체 흐름을 한눈에 확인할 수 있습니다.</p>
              <div className="dpp-timeline" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            </section>
          ) : null}

          {zoom.length > 0 ? (
            <section className="dpp-block">
              <p className="dpp-block__num">04</p>
              <h3>ZOOM DETAIL</h3>
              <p className="dpp-block__text">주요 영역을 확대하여 디자인 요소와 정보를 더 자세히 보여줍니다.</p>
              <ul className="dpp-zoom">
                {zoom.map((item) => (
                  <li key={item.title}>
                    <h4>{item.title}</h4>
                    {item.desc ? <p>{item.desc}</p> : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        {project.detailImage ? (
          <aside className="dpp-side">
            <div className="dpp-side__preview">
              <p className="dpp-side__label">FULL PAGE PREVIEW</p>
              <p className="dpp-side__sub">상세페이지 전체 미리보기</p>
              <button
                type="button"
                className="dpp-side__frame"
                aria-label={`${project.name} 상세페이지 전체 보기`}
                onClick={() => setPreviewOpen(true)}
              >
                <img src={project.detailImage} alt="" draggable={false} />
              </button>
            </div>
          </aside>
        ) : null}
        {previewOpen && project.detailImage ? (
          <ScreenLightbox
            src={project.detailImage}
            alt={`${project.name} 상세페이지 전체 이미지`}
            onClose={() => setPreviewOpen(false)}
          />
        ) : null}
      </div>

      <nav className="case-pager" aria-label="다른 프로젝트">
        {previous ? (
          <button type="button" onClick={() => onOpen(previous.id)}>
            <span>PREVIOUS PROJECT</span>
            <strong>PROJECT {previous.number}</strong>
          </button>
        ) : (
          <span />
        )}
        {next ? (
          <button type="button" className="is-next" onClick={() => onOpen(next.id)}>
            <span>NEXT PROJECT</span>
            <strong>PROJECT {next.number} →</strong>
          </button>
        ) : null}
      </nav>
    </article>
  )
}

export default function ProjectDetailView({ project, previous, next, onBack, onOpen }: ProjectDetailProps) {
  if (project.category === 'detail') {
    return <DetailPageProject project={project} previous={previous} next={next} onBack={onBack} onOpen={onOpen} />
  }

  const tags = (project.tags ?? []).filter(Boolean)
  const facts = [
    project.year ? { label: 'YEAR', value: project.year } : null,
    project.period ? { label: 'PERIOD', value: project.period } : null,
    project.role && project.role.length > 0 ? { label: 'ROLE', value: project.role.join(' · ') } : null,
    project.team ? { label: 'TEAM', value: project.team } : null,
    project.tools && project.tools.length > 0 ? { label: 'TOOLS', value: project.tools.join(' · ') } : null,
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact))

  return (
    <article className="case-study">
      <header className="case-hero">
        <BackNav onBack={onBack} />
        <div className={`case-hero__layout${project.heroMockup ? '' : ' is-copy-only'}`}>
          <div className="case-hero__copy">
            <p className="case-hero__index">PROJECT {project.number}</p>
            <h2>{project.name}</h2>
            {project.subtitle ? <p className="case-hero__subtitle">{project.subtitle}</p> : null}
            {tags.length > 0 ? (
              <ul className="case-chips">
                {tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            ) : null}
            {facts.length > 0 ? (
              <dl className="case-facts">
                {facts.map((fact) => (
                  <div key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
          {project.heroMockup ? (
            project.website ? (
              <a
                className="project-hero-mockup has-image is-live"
                href={project.website}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${project.name} live website`}
                style={{ '--mockup-mask': `url("${project.heroMockup}")` } as CSSProperties}
              >
                <img src={project.heroMockup} alt="" draggable={false} />
                <span className="project-hero-mockup__cue" aria-hidden="true">
                  <ArrowUpRight className="project-hero-mockup__cue-icon" />
                </span>
                <span className="project-hero-mockup__live">
                  VIEW LIVE SITE
                  <ArrowUpRight />
                </span>
              </a>
            ) : (
              <div className="project-hero-mockup has-image">
                <img src={project.heroMockup} alt={`${project.name} mockup`} draggable={false} />
              </div>
            )
          ) : null}
        </div>
      </header>

      {orderedSections(project.sections).map((section, index) => (
        <SectionBlock
          key={`${project.id}-${section.type}-${index}`}
          index={index + 1}
          section={section}
          summary={project.summary}
        />
      ))}

      <nav className="case-pager" aria-label="다른 프로젝트">
        {previous ? (
          <button type="button" onClick={() => onOpen(previous.id)}>
            <span>PREVIOUS PROJECT</span>
            <strong>PROJECT {previous.number}</strong>
          </button>
        ) : (
          <span />
        )}
        {next ? (
          <button type="button" className="is-next" onClick={() => onOpen(next.id)}>
            <span>NEXT PROJECT</span>
            <strong>PROJECT {next.number} →</strong>
          </button>
        ) : null}
      </nav>
    </article>
  )
}
