import { useCallback, useEffect, useState } from 'react'
import { desktopFiles } from '../../data/desktopFiles'
import type { WindowState } from '../../types/desktop'
import CustomCursor from '../CustomCursor/CustomCursor'
import DesktopFile from '../DesktopFile/DesktopFile'
import MenuBar from '../MenuBar/MenuBar'
import Window from '../Window/Window'
import AboutWindow from '../windows/AboutWindow'
import ContactWindow from '../windows/ContactWindow'
import NotesWindow from '../windows/NotesWindow'
import ProjectsWindow from '../windows/ProjectsWindow'
import ResumeWindow from '../windows/ResumeWindow'
import './Desktop.css'

function useIsCoarsePointer() {
  const [coarse, setCoarse] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px), (hover: none)')
    const update = () => setCoarse(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return coarse
}

function renderWindowContent(fileId: string) {
  switch (fileId) {
    case 'projects':
      return <ProjectsWindow />
    case 'about':
      return <AboutWindow />
    case 'resume':
      return <ResumeWindow />
    case 'notes':
      return <NotesWindow />
    case 'contact':
      return <ContactWindow />
    default:
      return null
  }
}

export default function Desktop() {
  const [activeWindow, setActiveWindow] = useState<WindowState | null>(null)
  const [hoveredFileId, setHoveredFileId] = useState<string | null>(null)
  const [playIntro, setPlayIntro] = useState(true)
  const isCoarse = useIsCoarsePointer()

  useEffect(() => {
    const id = window.setTimeout(() => setPlayIntro(false), 1800)
    return () => window.clearTimeout(id)
  }, [])

  const openFile = useCallback((fileId: string) => {
    setActiveWindow({ fileId, isClosing: false })
  }, [])

  const requestClose = useCallback(() => {
    setActiveWindow((prev) => (prev ? { ...prev, isClosing: true } : null))
  }, [])

  const completeClose = useCallback(() => {
    setActiveWindow(null)
  }, [])

  const activeFile = activeWindow
    ? desktopFiles.find((f) => f.id === activeWindow.fileId)
    : null

  return (
    <div className="desktop-shell">
      {/* Separated background layer — swap image/texture here later */}
      <div className="desktop-shell__bg" aria-hidden="true" />

      <div className="desktop-shell__ui">
        <MenuBar />

        <main className="desktop" aria-label="데스크톱">
          <div className="desktop__files">
            {desktopFiles.map((file) => (
              <DesktopFile
                key={file.id}
                file={file}
                isActive={activeWindow?.fileId === file.id && !activeWindow.isClosing}
                playIntro={file.id === 'projects' && playIntro}
                onOpen={openFile}
                onHoverChange={setHoveredFileId}
              />
            ))}
          </div>

          <p className="desktop__hint">궁금한 파일을 열어보세요.</p>

          {activeWindow && activeFile && (
            <Window
              key={activeFile.id}
              title={activeFile.windowTitle}
              size={activeFile.windowSize}
              offset={activeFile.windowOffset}
              isClosing={activeWindow.isClosing}
              onClose={requestClose}
              onCloseComplete={completeClose}
            >
              {renderWindowContent(activeFile.id)}
            </Window>
          )}
        </main>
      </div>

      <CustomCursor
        enabled={!isCoarse}
        visible={Boolean(hoveredFileId) && !activeWindow}
      />
    </div>
  )
}
