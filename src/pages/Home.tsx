import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ENGINE_LABELS, ENGINE_DESCRIPTIONS } from '../utils/constants'
import { useProjectStore } from '../stores/projectStore'
import type { EngineType } from '../types'

const engines: EngineType[] = ['mermaid', 'excalidraw', 'drawio']

export default function Home() {
  const navigate = useNavigate()
  const { addProject } = useProjectStore()
  const [selectedEngine, setSelectedEngine] = useState<EngineType>('mermaid')
  const [prompt, setPrompt] = useState('')

  const handleQuickGenerate = async () => {
    const project = await addProject(`新图表 ${Date.now()}`, selectedEngine)
    navigate(`/editor/${project.id}`)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        创建新图表
      </h1>

      {/* 引擎选择 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
          选择绘图引擎
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {engines.map((engine) => (
            <button
              key={engine}
              onClick={() => setSelectedEngine(engine)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                selectedEngine === engine
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
              }`}
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                {ENGINE_LABELS[engine]}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {ENGINE_DESCRIPTIONS[engine]}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* 快速生成 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
          快速生成
        </h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="用自然语言描述你想要的图表..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            onKeyDown={(e) => e.key === 'Enter' && handleQuickGenerate()}
          />
          <button
            onClick={handleQuickGenerate}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            生成图表
          </button>
        </div>
      </div>

      {/* 示例提示 */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
          示例提示词
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            '画一个用户登录流程图',
            '画一个电商系统架构图',
            '画一个下单时序图',
            '画一个项目管理思维导图',
          ].map((example) => (
            <button
              key={example}
              onClick={() => setPrompt(example)}
              className="p-4 text-left rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 transition-colors"
            >
              <span className="text-gray-700 dark:text-gray-300">{example}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
