import { ENGINE_LABELS } from '../../utils/constants'

interface PromptTemplatesProps {
  engine: string
  onSelect: (template: string) => void
}

const templates = {
  mermaid: [
    { title: '流程图', prompt: '画一个用户登录流程图，包含：输入信息、验证邮箱、设置密码、注册成功' },
    { title: '架构图', prompt: '画一个微服务架构图，包含：API 网关、用户服务、订单服务、支付服务、数据库' },
    { title: '时序图', prompt: '画一个用户下单的时序图，涉及：用户、前端、后端、数据库、支付系统' },
    { title: '思维导图', prompt: '画一个项目管理的思维导图，包含：计划、执行、监控、收尾四个阶段' },
  ],
  excalidraw: [
    { title: '头脑风暴', prompt: '画一个关于产品功能的头脑风暴图' },
    { title: '草图', prompt: '画一个简单的 App 界面草图' },
  ],
  drawio: [
    { title: '网络拓扑', prompt: '画一个公司网络拓扑图' },
    { title: '流程图', prompt: '画一个订单处理流程图' },
  ],
}

export default function PromptTemplates({ engine, onSelect }: PromptTemplatesProps) {
  const items = templates[engine as keyof typeof templates] || []

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
        {ENGINE_LABELS[engine as keyof typeof ENGINE_LABELS]} 示例
      </h3>
      <div className="space-y-2">
        {items.map((item) => (
          <button
            key={item.title}
            onClick={() => onSelect(item.prompt)}
            className="w-full text-left px-3 py-2 text-sm rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="font-medium text-gray-700 dark:text-gray-300">{item.title}:</span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">{item.prompt}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
