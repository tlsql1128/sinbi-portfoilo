import { projectRecords } from './projects.source'

export const projectCategories = [
  { id: 'all', label: '전체', meta: 'ALL' },
  { id: 'detail', label: '상세페이지', meta: 'DETAIL PAGE' },
  { id: 'landing', label: '랜딩페이지', meta: 'LANDING' },
  { id: 'website', label: '웹사이트', meta: 'WEB SITE' },
  { id: 'team', label: '팀 프로젝트', meta: 'TEAM PROJECT' },
] as const

export type ProjectFilter = (typeof projectCategories)[number]['id']
export type ProjectCategory = Exclude<ProjectFilter, 'all'>

export type ScreenLayout = 'full' | 'two-column' | 'three-column' | 'horizontal-scroll'

export type CaseSection =
  | {
      type: 'overview'
      title?: string
      keyMessage?: string
      highlight?: string
      description: string
      keyPoints?: { title: string; text?: string }[]
    }
  | {
      type: 'challenge'
      title?: string
      description: string
      items?: string[]
    }
  | {
      type: 'goal'
      title?: string
      description?: string
      items: { title: string; text?: string }[]
    }
  | {
      type: 'solution'
      title?: string
      description: string
      items?: string[]
    }
  | {
      type: 'designPoint'
      title?: string
      points: { title: string; text: string; image?: string | null; align?: 'image-left' | 'image-right' }[]
    }
  | {
      type: 'designSystem'
      title?: string
      colors?: string[]
      typography?: { family: string; styles: string[] }
      devices?: {
        desktop?: string | null
        tablet?: string | null
        mobile?: string | null
      }
      groups?: { title: string; items: string[] }[]
      notes?: string[]
    }
  | {
      type: 'process'
      title?: string
      style?: 'flow' | 'steps'
      steps: string[]
    }
  | {
      type: 'role'
      title?: string
      items: { label: string; value?: string }[]
    }
  | {
      type: 'screens'
      title?: string
      items?: { id: string | number; title: string; image?: string | null; objectPosition?: string }[]
      groups?: { label: string; layout: ScreenLayout; images: (string | null)[]; ratio?: string }[]
    }
  | {
      type: 'responsive'
      title?: string
      devices: { label: string; image?: string | null; ratio?: string }[]
    }
  | {
      type: 'result'
      title?: string
      description?: string
      items?: string[]
    }

export type Project = {
  id: string
  number: string
  name: string
  subtitle: string
  category: ProjectCategory
  disciplines: string
  year: string
  description: string
  overviewHeadline?: string
  overviewHighlight?: string
  period?: string
  role?: string[]
  tools?: string[]
  tags?: string[]
  team?: string
  website?: string
  concept?: string
  keywords?: string[]
  accent?: string
  features?: { title: string; desc: string }[]
  colors?: string[]
  detailImage?: string | null
  zoom?: { title: string; desc: string }[]
  summary?: string
  heroImage?: string | null
  heroMockup?: string | null
  heroRatio?: string
  image?: string
  featured?: boolean
  featuredDescription?: string
  sections: CaseSection[]
}

type ProjectRecord = {
  id: string
  type: string
  title: string
  desc?: string[]
  tags?: string[]
  year?: string
  period?: string
  role?: string
  team?: string
  tools?: string[]
  website?: string
  overview?: string
  overviewHeadline?: string
  overviewHighlight?: string
  features?: { title: string; desc: string }[]
  concept?: string
  solution?: { text?: string; items?: string[] }
  colors?: string[]
  accent?: string
  font?: string
  fontStyles?: string[]
  keywords?: string[]
  screens?: { label: string; image: string; objectPosition?: string }[]
  mockup?: string
  devices?: { desktop?: string; tablet?: string; mobile?: string }
  detailImage?: string
  zoom?: { title: string; desc: string }[]
  featured?: boolean
  featuredDescription?: string
}

const projectImages = import.meta.glob('../assets/images/projects/*.{webp,png,svg}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const imageByName = new Map<string, string>()

for (const [path, url] of Object.entries(projectImages)) {
  const fileName = decodeURIComponent(path.split('/').pop() ?? '')
  const stem = fileName.replace(/\.(webp|png|svg)$/i, '').toLowerCase()
  if (!imageByName.has(stem)) imageByName.set(stem, url)
}

function projectImage(legacyPath?: string) {
  if (!legacyPath) return null
  const fileName = decodeURIComponent(legacyPath.split('/').pop() ?? '')
  const stem = fileName.replace(/\.(webp|png|svg)$/i, '').toLowerCase()
  return imageByName.get(stem) ?? null
}

const coverAliases: Record<string, string> = {
  leo: 'lemon',
  sentinel: 'sentinelarospace',
  'crystal-glass': 'crystal glass',
  'preservative-wood': 'preservative wood',
  'computational-platform': 'Computational Platform',
}

function coverImage(id: string, title: string) {
  const names = [coverAliases[id], id, title]
    .filter((name): name is string => Boolean(name))
    .flatMap((name) => {
      const lower = name.trim().toLowerCase()
      return [lower, lower.replace(/[\s_-]+/g, '')]
    })

  for (const name of names) {
    const image = imageByName.get(name)
    if (image) return image
  }

  return null
}

function pad(value: number) {
  return String(value).padStart(2, '0')
}

function categoryOf(record: ProjectRecord): ProjectCategory {
  const tags = record.tags ?? []
  if (tags.some((tag) => tag.toLowerCase() === 'team project')) return 'team'
  if (record.type === 'detail') return 'detail'
  if (record.type === 'landing' || tags.some((tag) => tag.toLowerCase() === 'landing page')) return 'landing'
  return 'website'
}

function screenTitle(label: string) {
  return label.replace(/^\d+\.\s*/, '').trim() || label
}

function toProject(record: ProjectRecord, index: number): Project {
  const mockup = projectImage(record.mockup)
  const overview = record.overview?.trim() ?? ''
  const features = record.features ?? []
  const sections: CaseSection[] = []

  if (record.type !== 'detail' && (overview || features.length > 0 || record.overviewHeadline)) {
    sections.push({
      type: 'overview',
      description: overview,
      keyMessage: record.overviewHeadline,
      highlight: record.overviewHighlight,
      keyPoints: features.slice(0, 3).map((feature) => ({ title: feature.title, text: feature.desc })),
    })
  }

  const devices = {
    desktop: projectImage(record.devices?.desktop),
    tablet: projectImage(record.devices?.tablet),
    mobile: projectImage(record.devices?.mobile),
  }
  const resolvedDevices = {
    ...(devices.desktop ? { desktop: devices.desktop } : {}),
    ...(devices.tablet ? { tablet: devices.tablet } : {}),
    ...(devices.mobile ? { mobile: devices.mobile } : {}),
  }
  const colors = (record.colors ?? []).filter(Boolean)
  const font = record.font?.trim() || 'Pretendard'
  const fontStyles = record.fontStyles?.length ? record.fontStyles : ['Bold', 'Medium', 'Regular']
  if (record.type !== 'detail' && (colors.length > 0 || record.font || Object.keys(resolvedDevices).length > 0)) {
    sections.push({
      type: 'designSystem',
      ...(colors.length > 0 ? { colors } : {}),
      typography: { family: font, styles: fontStyles },
      ...(Object.keys(resolvedDevices).length > 0 ? { devices: resolvedDevices } : {}),
    })
  }

  const screens = (record.screens ?? [])
    .map((screen, screenIndex) => ({
      id: `${record.id}-screen-${screenIndex}`,
      title: screenTitle(screen.label),
      image: projectImage(screen.image),
      ...(screen.objectPosition ? { objectPosition: screen.objectPosition } : {}),
    }))
    .filter((screen) => Boolean(screen.image))

  const detailImage = projectImage(record.detailImage)
  if (record.type !== 'detail' && screens.length > 0) {
    sections.push({
      type: 'screens',
      title: 'MAIN SCREENS',
      items: screens,
    })
  }

  const subtitle = (record.desc ?? []).map((line) => line.trim()).filter(Boolean).join('\n')
  const role = record.role
    ?.split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  return {
    id: record.id,
    number: pad(index + 1),
    name: record.title,
    subtitle,
    category: categoryOf(record),
    disciplines: role?.[0] ?? 'UI/UX',
    year: record.year ?? '',
    description: overview,
    overviewHeadline: record.overviewHeadline,
    overviewHighlight: record.overviewHighlight,
    period: record.period,
    role,
    tools: record.tools,
    tags: record.tags,
    team: record.team,
    website: record.website,
    concept: record.concept,
    keywords: record.keywords,
    accent: record.accent,
    features,
    colors,
    detailImage,
    zoom: record.zoom,
    heroMockup: mockup,
    image: coverImage(record.id, record.title) ?? undefined,
    featured: record.featured === true,
    featuredDescription: record.featuredDescription?.trim() || undefined,
    sections,
  }
}

const records = projectRecords as unknown as ProjectRecord[]

export const projectsIntro = '사용자 중심의 경험을 설계한 UI/UX 프로젝트입니다.'

export const projects: Project[] = records.map(toProject)

export function projectIdFromPath(pathname: string) {
  const match = pathname.match(/^\/projects\/([^/]+)\/?$/)
  if (!match) return null
  const id = decodeURIComponent(match[1])
  return projects.some((project) => project.id === id) ? id : null
}
