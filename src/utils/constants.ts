export const DB_NAME = 'hello-draw-db'
export const DB_VERSION = 1

export const STORES = {
  PROJECTS: 'projects',
  VERSIONS: 'versions',
} as const

export const DEFAULT_AI_CONFIG = {
  provider: 'glm' as const,
  apiUrl: '',
  apiKey: '',
  modelId: 'glm-4-flash',
}

export const ENGINE_LABELS = {
  mermaid: 'Mermaid',
  excalidraw: 'Excalidraw',
  drawio: 'Draw.io',
} as const

export const ENGINE_DESCRIPTIONS = {
  mermaid: '代码驱动，简洁工整，适合流程图、时序图、类图',
  excalidraw: '手绘风格，简洁美观，适合头脑风暴、草图、概念图',
  drawio: '功能丰富，专业强大，适合复杂架构图、网络拓扑图',
} as const
