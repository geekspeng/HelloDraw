export type EngineType = 'mermaid' | 'excalidraw' | 'drawio'

export type AIProvider = 'glm' | 'minimax' | 'openai' | 'custom'

export interface Project {
  id: string
  name: string
  engine: EngineType
  content: string
  createdAt: number
  updatedAt: number
}

export interface Version {
  id: string
  projectId: string
  content: string
  createdAt: number
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  chartContent?: string
  createdAt: number
}

export interface AIConfig {
  provider: AIProvider
  apiUrl: string
  apiKey: string
  modelId: string
}

export interface Settings {
  theme: 'light' | 'dark' | 'auto'
  accessPassword: string | null
  aiConfig: AIConfig
}
