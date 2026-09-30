export type FileType = 'folder' | 'pdf' | 'text' | 'mail'
export type WindowSizePreset = 'large' | 'medium' | 'small'

export interface DesktopFileData {
  id: string
  name: string
  type: FileType
  icon: FileType
  windowTitle: string
  windowSize: WindowSizePreset
  /** Desktop absolute position (% of desktop area) */
  position: {
    x: number
    y: number
  }
  /** Tablet absolute position */
  tabletPosition?: {
    x: number
    y: number
  }
  /** Slight offset from center for window placement (px) */
  windowOffset: {
    x: number
    y: number
  }
}

export interface WindowState {
  fileId: string
  isClosing: boolean
}
