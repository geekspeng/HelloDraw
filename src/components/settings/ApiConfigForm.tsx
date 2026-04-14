import { useState } from 'react'
import { useSettingsStore } from '../../stores/settingsStore'
import { testAIConnection } from '../../services/aiService'
import type { AIProvider } from '../../types'

const providers: { value: AIProvider; label: string; defaultUrl: string; defaultModel: string }[] = [
  { value: 'glm', label: '智谱 GLM', defaultUrl: 'https://open.bigmodel.cn/api/paas/v4', defaultModel: 'glm-4-flash' },
  { value: 'minimax', label: 'MiniMax', defaultUrl: 'https://api.minimax.chat/v', defaultModel: 'MiniMax-Text-01' },
  { value: 'openai', label: 'OpenAI', defaultUrl: 'https://api.openai.com/v1', defaultModel: 'gpt-4o-mini' },
  { value: 'custom', label: '自定义', defaultUrl: '', defaultModel: '' },
]

export default function ApiConfigForm() {
  const { settings, updateAIConfig } = useSettingsStore()
  const { aiConfig } = settings
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null)

  const currentProvider = providers.find((p) => p.value === aiConfig.provider) || providers[3]

  const handleProviderChange = (provider: AIProvider) => {
    const p = providers.find((pr) => pr.value === provider)
    updateAIConfig({
      ...aiConfig,
      provider,
      apiUrl: p?.defaultUrl || '',
      modelId: p?.defaultModel || '',
    })
  }

  const handleTest = async () => {
    setTesting(true)
    setTestResult(null)
    const success = await testAIConnection(aiConfig)
    setTestResult(success ? 'success' : 'error')
    setTesting(false)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          AI 提供商
        </label>
        <select
          value={aiConfig.provider}
          onChange={(e) => handleProviderChange(e.target.value as AIProvider)}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          {providers.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          API 地址
        </label>
        <input
          type="text"
          value={aiConfig.apiUrl}
          onChange={(e) => updateAIConfig({ ...aiConfig, apiUrl: e.target.value })}
          placeholder="https://api.example.com/v1"
          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          API Key
        </label>
        <input
          type="password"
          value={aiConfig.apiKey}
          onChange={(e) => updateAIConfig({ ...aiConfig, apiKey: e.target.value })}
          placeholder="sk-..."
          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <p className="mt-1 text-xs text-gray-500">
          API Key 仅存储在本地浏览器中
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          模型 ID
        </label>
        <input
          type="text"
          value={aiConfig.modelId}
          onChange={(e) => updateAIConfig({ ...aiConfig, modelId: e.target.value })}
          placeholder={currentProvider.defaultModel}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleTest}
          disabled={!aiConfig.apiUrl || !aiConfig.apiKey || testing}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
        >
          {testing ? '测试中...' : '测试连接'}
        </button>
        {testResult === 'success' && (
          <span className="text-sm text-green-600">连接成功</span>
        )}
        {testResult === 'error' && (
          <span className="text-sm text-red-600">连接失败</span>
        )}
      </div>
    </div>
  )
}
