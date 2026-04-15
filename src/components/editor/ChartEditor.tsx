import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProjectStore } from '../../stores/projectStore'
import { useChatStore } from '../../stores/chatStore'
import MermaidPreview from './MermaidPreview'
import ExcalidrawCanvas from './ExcalidrawCanvas'
import DrawioCanvas from './DrawioCanvas'
import ChatPanel from '../chat/ChatPanel'
import VersionHistory from '../project/VersionHistory'
import { exportMermaidAsSvg, exportMermaidAsPng, downloadSvg } from '../../utils/exportUtils'

export default function ChartEditor() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const { getProject, currentProject, setCurrentProject, updateProject } = useProjectStore()
  const { setProjectId } = useChatStore()
  const { messages } = useChatStore()
  const [content, setContent] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const [exportMenuOpen, setExportMenuOpen] = useState(false)
  const lastMessageCountRef = useRef(0)

  const handleExport = async (format: 'svg' | 'png') => {
    if (currentProject?.engine !== 'mermaid') return

    try {
      if (format === 'svg') {
        const svg = await exportMermaidAsSvg(content)
        downloadSvg(svg, `${currentProject.name}.svg`)
      } else {
        await exportMermaidAsPng(content, `${currentProject.name}.png`)
      }
    } catch (err) {
      console.error('Export failed:', err)
    }
    setExportMenuOpen(false)
  }

  useEffect(() => {
    if (projectId) {
      const project = getProject(projectId)
      if (project) {
        setCurrentProject(project)
        setContent(project.content)
        // 切换项目时重置对话上下文
        setProjectId(projectId)
      } else {
        navigate('/')
      }
    }
  }, [projectId, getProject, setCurrentProject, setProjectId, navigate])

  // 更新内容当 AI 返回图表代码时
  useEffect(() => {
    if (messages.length > lastMessageCountRef.current) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role === 'assistant' && lastMessage.chartContent) {
        const newContent = lastMessage.chartContent
        setContent(newContent)
        if (currentProject) {
          updateProject(currentProject.id, { content: newContent })
        }
      }
      lastMessageCountRef.current = messages.length
    }
  }, [messages, currentProject, updateProject])

  const handleRestore = (restoredContent: string) => {
    setContent(restoredContent)
  }

  if (!currentProject) {
    return <div>加载中...</div>
  }

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col">
      {/* 工具栏 */}
      <div className="h-12 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
        <button
          onClick={() => navigate('/')}
          className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors"
        >
          ← 返回
        </button>
        <h1 className="font-medium text-gray-900 dark:text-white">
          {currentProject.name}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowHistory(true)}
            className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            历史记录
          </button>
          {currentProject?.engine === 'mermaid' && (
            <div className="relative">
              <button
                onClick={() => setExportMenuOpen(!exportMenuOpen)}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                导出 ▾
              </button>
              {exportMenuOpen && (
                <div className="absolute right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => handleExport('svg')}
                    className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    导出 SVG
                  </button>
                  <button
                    onClick={() => handleExport('png')}
                    className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    导出 PNG
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 内容区 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 画布区 */}
        <div className="flex-1 p-4 overflow-auto bg-gray-50 dark:bg-gray-900">
          {currentProject.engine === 'mermaid' && (
            <MermaidPreview code={content} className="min-h-full" />
          )}
          {currentProject.engine === 'excalidraw' && (
            <ExcalidrawCanvas initialData={content} />
          )}
          {currentProject.engine === 'drawio' && (
            <DrawioCanvas initialData={content} />
          )}
        </div>

        {/* 对话面板 */}
        <div className="w-96 flex flex-col">
          <ChatPanel engine={currentProject.engine} />
        </div>
      </div>

      {/* 版本历史弹窗 */}
      {showHistory && currentProject && (
        <VersionHistory
          projectId={currentProject.id}
          currentContent={content}
          onRestore={handleRestore}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  )
}
