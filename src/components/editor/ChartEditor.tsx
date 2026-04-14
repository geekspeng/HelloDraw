import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProjectStore } from '../../stores/projectStore'
import MermaidPreview from './MermaidPreview'
import ChatPanel from '../chat/ChatPanel'
import VersionHistory from '../project/VersionHistory'

export default function ChartEditor() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const { getProject, updateProject, currentProject, setCurrentProject } = useProjectStore()
  const [content, setContent] = useState('')
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    if (projectId) {
      const project = getProject(projectId)
      if (project) {
        setCurrentProject(project)
        setContent(project.content)
      } else {
        navigate('/')
      }
    }
  }, [projectId, getProject, setCurrentProject, navigate])

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    if (currentProject) {
      updateProject(currentProject.id, { content: newContent })
    }
  }

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
          <button
            onClick={() => {/* TODO: 导出功能 */}}
            className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            导出
          </button>
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
            <div className="text-gray-400">Excalidraw 画布（开发中）</div>
          )}
          {currentProject.engine === 'drawio' && (
            <div className="text-gray-400">Draw.io 画布（开发中）</div>
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
