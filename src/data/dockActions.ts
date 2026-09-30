import toolCall from '../assets/images/tool-call.png'
import toolPdf from '../assets/images/tool-pdf.png'
import kakaoQr from '../assets/images/qr.png'

export interface ContactAction {
  id: 'contact'
  title: string
  icon: string
  description: string
  phone: string
  email: string
  qr: string
}

export interface ResumeAction {
  id: 'resume'
  title: string
  icon: string
  description: string
  fileName: string
  resumeUrl: string
}

export type DockAction = ContactAction | ResumeAction

export const dockActions = {
  contact: {
    id: 'contact',
    title: 'Contact',
    icon: toolCall,
    description:
      '프로젝트, 협업 또는 궁금한 점이 있다면 편하게 연락해 주세요. 확인 후 가능한 빠르게 답변드리겠습니다.',
    phone: '010-2300-6342',
    email: 'tlsql11282@gmail.com',
    qr: kakaoQr,
  },
  resume: {
    id: 'resume',
    title: 'Resume',
    icon: toolPdf,
    description:
      '지금까지의 경험과 프로젝트, 사용 가능한 툴과 역량을 정리한 이력서입니다. PDF 파일로 자세한 내용을 확인할 수 있습니다.',
    fileName: 'UIUX_Designer_Resume.pdf',
    resumeUrl: '',
  },
} as const satisfies { contact: ContactAction; resume: ResumeAction }

export type DockActionId = keyof typeof dockActions
