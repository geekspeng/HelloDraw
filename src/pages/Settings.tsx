import { useState } from 'react'
import { useSettingsStore } from '../stores/settingsStore'
import ApiConfigForm from '../components/settings/ApiConfigForm'
import { getAllProjects, saveProject, deleteProject, getVersionsByProject, saveVersion } from '../services/dbService'
import type { Project, Version } from '../types'

export default function Settings() {
  const { settings, updateTheme } = useSettingsStore()
  const [exporting, setExporting] = useState(false)
  const [importing, setImporting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleExportData = async () => {
    setExporting(true)
    setMessage(null)
    try {
      const projects = await getAllProjects()
      const exportData = {
        version: 1,
        exportedAt: Date.now(),
        projects,
        versions: [] as Version[],
      }

      // Include versions for each project
      for (const project of projects) {
        const versions = await getVersionsByProject(project.id)
        exportData.versions.push(...versions)
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `hello-draw-backup-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
      setMessage({ type: 'success', text: '导出成功' })
    } catch (err) {
      setMessage({ type: 'error', text: '导出失败' })
    }
    setExporting(false)
  }

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImporting(true)
    setMessage(null)
    try {
      const text = await file.text()
      const data = JSON.parse(text)

      if (!data.version || !data.projects) {
        throw new Error('Invalid backup file')
      }

      let imported = 0
      for (const project of data.projects) {
        await saveProject(project)
        imported++
      }

      if (data.versions) {
        for (const version of data.versions) {
          await saveVersion(version)
        }
      }

      setMessage({ type: 'success', text: `导入成功，共导入 ${imported} 个项目` })
    } catch (err) {
      setMessage({ type: 'error', text: '导入失败：文件格式错误' })
    }
    setImporting(false)
    event.target.value = ''
  }

  const handleClearAllData = async () => {
    if (!confirm('确定要清除所有数据吗？此操作不可恢复！')) return

    try {
      const projects = await getAllProjects()
      for (const project of projects) {
        await deleteProject(project.id)
      }
      setMessage({ type: 'success', text: '数据已清除' })
    } catch (err) {
      setMessage({ type: 'error', text: '清除失败' })
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        设置
      </h1>

      <div className="space-y-8">
        {/* API 配置 */}
        <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            API 配置
          </h2>
          <ApiConfigForm />
        </section>

        {/* 主题 */}
        <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            外观
          </h2>
          <div className="flex gap-4">
            {(['light', 'dark', 'auto'] as const).map((theme) => (
              <button
                key={theme}
                onClick={() => updateTheme(theme)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  settings.theme === theme
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {theme === 'light' ? '浅色' : theme === 'dark' ? '深色' : '自动'}
              </button>
            ))}
          </div>
        </section>

        {/* 数据管理 */}
        <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            数据管理
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleExportData}
                disabled={exporting}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                {exporting ? '导出中...' : '导出数据'}
              </button>
              <label className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                {importing ? '导入中...' : '导入数据'}
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  disabled={importing}
                  className="hidden"
                />
              </label>
            </div>
            {message && (
              <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {message.text}
              </p>
            )}
            <hr className="border-gray-200 dark:border-gray-700" />
            <button
              onClick={handleClearAllData}
              className="px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
            >
              清除所有数据
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
