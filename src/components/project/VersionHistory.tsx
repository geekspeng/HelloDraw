import { useState, useEffect } from 'react'
import type { Version } from '../../types'
import { getVersionsByProject, saveVersion } from '../../services/dbService'
import { useProjectStore } from '../../stores/projectStore'
import { v4 as uuidv4 } from 'uuid'

interface VersionHistoryProps {
  projectId: string
  currentContent: string
  onRestore: (content: string) => void
  onClose: () => void
}

export default function VersionHistory({
  projectId,
  currentContent,
  onRestore,
  onClose,
}: VersionHistoryProps) {
  const [versions, setVersions] = useState<Version[]>([])
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null)
  const { updateProject } = useProjectStore()

  useEffect(() => {
    loadVersions()
  }, [projectId])

  const loadVersions = async () => {
    const v = await getVersionsByProject(projectId)
    setVersions(v)
    if (v.length > 0 && !selectedVersion) {
      setSelectedVersion(v[0])
    }
  }

  const handleSaveVersion = async () => {
    const version: Version = {
      id: uuidv4(),
      projectId,
      content: currentContent,
      createdAt: Date.now(),
    }
    await saveVersion(version)
    await loadVersions()
  }

  const handleRestore = () => {
    if (selectedVersion) {
      updateProject(projectId, { content: selectedVersion.content })
      onRestore(selectedVersion.content)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-lg max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            版本历史
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        <div className="p-4 max-h-[60vh] overflow-auto">
          {versions.length === 0 ? (
            <p className="text-center text-gray-400">暂无版本记录</p>
          ) : (
            <div className="space-y-2">
              {versions.map((version) => (
                <button
                  key={version.id}
                  onClick={() => setSelectedVersion(version)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedVersion?.id === version.id
                      ? 'bg-blue-600/10 border border-blue-600'
                      : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(version.createdAt).toLocaleString('zh-CN')}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                    {version.content.slice(0, 50)}...
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-4">
          <button
            onClick={handleSaveVersion}
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            保存当前版本
          </button>
          <button
            onClick={handleRestore}
            disabled={!selectedVersion}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            恢复选中版本
          </button>
        </div>
      </div>
    </div>
  )
}
