import toolCap from '../assets/images/tool-cap.png'
import toolClu from '../assets/images/tool-clu.png'
import toolCur from '../assets/images/tool-cur.png'
import toolFig from '../assets/images/tool-fig.png'
import toolGit from '../assets/images/tool-git.png'
import toolGmi from '../assets/images/tool-gmi.png'
import toolGpt from '../assets/images/tool-gpt.png'
import toolPho from '../assets/images/tool-pho.png'
import toolSla from '../assets/images/tool-sla.png'

export interface ToolItem {
  id: string
  name: string
  category: string
  description: string
  tags: string[]
  icon: string
}

export const tools: ToolItem[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    category: 'IDEA · RESEARCH · WRITING',
    description:
      '아이디어를 확장하고 UX 리서치 내용을 정리하거나, 프로젝트에 필요한 카피와 다양한 방향의 초안을 빠르게 탐색할 때 활용합니다.',
    tags: ['아이디어 확장', 'UX 리서치 정리', '카피 초안', '기획 보조'],
    icon: toolGpt,
  },
  {
    id: 'gemini',
    name: 'Gemini',
    category: 'RESEARCH · ANALYSIS · EXPLORE',
    description:
      '다양한 자료를 탐색하고 정보를 비교하거나, 프로젝트 초기에 여러 가능성과 방향성을 빠르게 살펴볼 때 활용합니다.',
    tags: ['자료 탐색', '정보 비교', '아이디어 탐색', '리서치 보조'],
    icon: toolGmi,
  },
  {
    id: 'claude',
    name: 'Claude',
    category: 'DOCUMENT · STRUCTURE · ANALYSIS',
    description:
      '긴 문서와 많은 정보를 구조화하고, 기획 내용을 정리하거나 복잡한 내용을 읽기 쉬운 형태로 다듬을 때 활용합니다.',
    tags: ['문서 구조화', '기획 정리', '내용 요약', '텍스트 정리'],
    icon: toolClu,
  },
  {
    id: 'figma',
    name: 'Figma',
    category: 'UI DESIGN · UX · PROTOTYPING',
    description:
      '와이어프레임부터 UI 디자인, 컴포넌트 설계와 프로토타이핑까지 프로젝트의 화면을 구체화하는 핵심 디자인 툴로 활용합니다.',
    tags: ['UI 디자인', '와이어프레임', '프로토타입', '디자인 시스템'],
    icon: toolFig,
  },
  {
    id: 'photoshop',
    name: 'Photoshop',
    category: 'VISUAL · EDITING · GRAPHIC',
    description:
      '프로젝트에 필요한 이미지를 보정하고 합성하거나, KV와 목업 등 화면의 완성도를 높이는 비주얼 작업에 활용합니다.',
    tags: ['이미지 보정', '이미지 합성', '비주얼 디자인', '목업 제작'],
    icon: toolPho,
  },
  {
    id: 'cursor',
    name: 'Cursor',
    category: 'DEVELOP · IMPLEMENT · INTERACTION',
    description:
      '디자인한 화면을 실제 웹 인터페이스로 구현하고, 인터랙션을 테스트하거나 디자인 아이디어를 빠르게 프로토타입으로 제작할 때 활용합니다.',
    tags: ['프론트엔드 구현', '인터랙션 구현', '프로토타이핑', 'AI 코딩'],
    icon: toolCur,
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'VERSION · COLLABORATION · DEPLOY',
    description:
      '프로젝트의 코드와 변경 사항을 관리하고, 웹 프로젝트의 버전을 기록하거나 배포 과정에서 활용합니다.',
    tags: ['버전 관리', '코드 관리', '프로젝트 기록', '웹 배포'],
    icon: toolGit,
  },
  {
    id: 'slack',
    name: 'Slack',
    category: 'COMMUNICATION · FEEDBACK · TEAM',
    description:
      '프로젝트 진행 과정에서 팀원과 소통하고, 피드백과 자료를 공유하며 협업 내용을 빠르게 확인하고 정리할 때 활용합니다.',
    tags: ['팀 커뮤니케이션', '피드백 공유', '자료 공유', '협업'],
    icon: toolSla,
  },
  {
    id: 'capcut',
    name: 'CapCut',
    category: 'VIDEO · MOTION · EDITING',
    description:
      '프로젝트 소개 영상이나 짧은 모션 콘텐츠를 제작하고, 인터랙션과 작업 과정을 영상으로 보여주기 위한 편집 작업에 활용합니다.',
    tags: ['영상 편집', '모션 콘텐츠', '프로젝트 영상', '숏폼 제작'],
    icon: toolCap,
  },
]
