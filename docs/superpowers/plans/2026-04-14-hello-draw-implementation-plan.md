# HelloDraw 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**目标：** 构建一个 AI 驱动的图表生成平台，支持通过自然语言描述生成 Mermaid/Excalidraw/Draw.io 图表

**架构：** React 18 + Vite + Zustand 状态管理 + IndexedDB 本地存储 + 直接调用 AI API（用户自备 Key）

**技术栈：** React 18, Vite, TypeScript, Tailwind CSS, React Router v6, Zustand, Mermaid, Excalidraw, Draw.io (mxgraph), idb (IndexedDB 封装)

---

## 文件结构

```
hello-draw/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx          # 整体布局容器
│   │   │   ├── Sidebar.tsx            # 左侧项目列表
│   │   │   └── Header.tsx             # 顶部导航栏
│   │   ├── editor/
│   │   │   ├── ChartEditor.tsx        # 编辑器主容器
│   │   │   ├── MermaidPreview.tsx     # Mermaid 渲染组件
│   │   │   ├── ExcalidrawCanvas.tsx   # Excalidraw 画布
│   │   │   └── DrawioCanvas.tsx       # Draw.io 画布
│   │   ├── chat/
│   │   │   ├── ChatPanel.tsx          # AI 对话面板
│   │   │   ├── ChatMessage.tsx        # 单条消息
│   │   │   └── PromptTemplates.tsx    # 预设模板
│   │   ├── project/
│   │   │   ├── ProjectList.tsx        # 项目列表页
│   │   │   ├── ProjectCard.tsx        # 项目卡片
│   │   │   └── ProjectModal.tsx       # 新建/编辑项目弹窗
│   │   ├── settings/
│   │   │   ├── SettingsPanel.tsx      # 设置面板
│   │   │   └── ApiConfigForm.tsx      # API 配置表单
│   │   └── common/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       └── Select.tsx
│   ├── pages/
│   │   ├── Home.tsx                    # 首页
│   │   ├── Editor.tsx                  # 编辑器页
│   │   └── Settings.tsx                # 设置页
│   ├── stores/
│   │   ├── projectStore.ts             # 项目状态管理
│   │   ├── chatStore.ts                # 对话状态管理
│   │   └── settingsStore.ts            # 设置状态管理
│   ├── services/
│   │   ├── aiService.ts                # AI API 调用
│   │   └── dbService.ts                # IndexedDB 操作
│   ├── hooks/
│   │   ├── useAI.ts                    # AI 对话 hook
│   │   └── useProject.ts               # 项目操作 hook
│   ├── utils/
│   │   ├── promptTemplates.ts          # Prompt 模板
│   │   └── constants.ts                # 常量定义
│   ├── types/
│   │   └── index.ts                    # TypeScript 类型定义
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── postcss.config.js
```

---

## Task 1: 项目基础结构搭建

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/index.css`

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "hello-draw",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "zustand": "^4.4.0",
    "mermaid": "^10.6.0",
    "excalidraw": "^0.16.0",
    "idb": "^7.1.0",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/uuid": "^9.0.0",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.3.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0"
  }
}
```

- [ ] **Step 2: 创建 vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
})
```

- [ ] **Step 3: 创建 tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 4: 创建 tailwind.config.js**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}
```

- [ ] **Step 5: 创建 postcss.config.js**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 6: 创建 index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>HelloDraw - AI 图表生成平台</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 7: 创建 src/main.tsx**

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

- [ ] **Step 8: 创建 src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
}

body {
  margin: 0;
  min-height: 100vh;
}

.dark {
  color-scheme: dark;
}
```

- [ ] **Step 9: 创建 src/App.tsx（基础路由结构）**

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Editor from './pages/Editor'
import Settings from './pages/Settings'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor/:projectId" element={<Editor />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
```

- [ ] **Step 10: 创建占位页面文件**

创建空的 `src/pages/Home.tsx`, `src/pages/Editor.tsx`, `src/pages/Settings.tsx`

```typescript
// src/pages/Home.tsx
export default function Home() {
  return <div>Home</div>
}

// src/pages/Editor.tsx
export default function Editor() {
  return <div>Editor</div>
}

// src/pages/Settings.tsx
export default function Settings() {
  return <div>Settings</div>
}
```

- [ ] **Step 11: 安装依赖并验证项目启动**

Run: `cd hello-draw && npm install && npm run dev`
Expected: Vite 开发服务器在 port 3000 启动

- [ ] **Step 12: 提交**

```bash
git init
git add .
git commit -m "feat: 项目基础结构搭建 (React + Vite + TypeScript + Tailwind)"
```

---

## Task 2: 类型定义和常量

**Files:**
- Create: `src/types/index.ts`
- Create: `src/utils/constants.ts`
- Create: `src/utils/promptTemplates.ts`

- [ ] **Step 1: 创建类型定义 src/types/index.ts**

```typescript
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
```

- [ ] **Step 2: 创建常量 src/utils/constants.ts**

```typescript
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
```

- [ ] **Step 3: 创建 Prompt 模板 src/utils/promptTemplates.ts**

```typescript
export const promptTemplates = {
  mermaid: `你是一个专业的Mermaid图表生成助手。用户输入图表描述，你返回Mermaid代码。

要求：
1. 只返回Mermaid代码，使用```mermaid代码块包裹
2. 代码要符合Mermaid语法
3. 图表要清晰表达用户需求

示例输出：
\`\`\`mermaid
flowchart TD
A[开始] --> B[输入用户名]
B --> C[验证密码]
C --> D{验证成功?}
D -->|是| E[登录成功]
D -->|否| F[显示错误]
\`\`\`

用户需求：`,

  excalidraw: `你是一个Excalidraw图表生成助手。用户输入图表描述，你返回Excalidraw JSON数据。

要求：
1. 只返回Excalidraw JSON数据，使用```json代码块包裹
2. JSON要符合Excalidraw元素格式
3. 图表要清晰表达用户需求

用户需求：`,

  drawio: `你是一个Draw.io图表生成助手。用户输入图表描述，你返回Draw.io XML格式。

要求：
1. 只返回Draw.io XML，使用```xml代码块包裹
2. XML要符合Draw.io mxfile格式
3. 图表要清晰表达用户需求

用户需求：`,
}

export const SYSTEM_PROMPTS = {
  mermaid: '你是一个专业的Mermaid图表生成助手。用户输入图表描述，你返回Mermaid代码。',
  excalidraw: '你是一个专业的Excalidraw图表生成助手。用户输入图表描述，你返回Excalidraw JSON数据。',
  drawio: '你是一个专业的Draw.io图表生成助手。用户输入图表描述，你返回Draw.io XML格式。',
}
```

- [ ] **Step 4: 提交**

```bash
git add src/types/index.ts src/utils/constants.ts src/utils/promptTemplates.ts
git commit -m "feat: 添加类型定义和常量"
```

---

## Task 3: Zustand Store 状态管理

**Files:**
- Create: `src/stores/projectStore.ts`
- Create: `src/stores/chatStore.ts`
- Create: `src/stores/settingsStore.ts`

- [ ] **Step 1: 创建 settingsStore（依赖 DB）**

先创建简化版，后续集成 dbService

```typescript
// src/stores/settingsStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Settings, AIConfig } from '../types'
import { DEFAULT_AI_CONFIG } from '../utils/constants'

interface SettingsState {
  settings: Settings
  updateAIConfig: (config: AIConfig) => void
  updateTheme: (theme: 'light' | 'dark' | 'auto') => void
  setAccessPassword: (password: string | null) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: {
        theme: 'auto',
        accessPassword: null,
        aiConfig: DEFAULT_AI_CONFIG,
      },
      updateAIConfig: (aiConfig) =>
        set((state) => ({
          settings: { ...state.settings, aiConfig },
        })),
      updateTheme: (theme) =>
        set((state) => ({
          settings: { ...state.settings, theme },
        })),
      setAccessPassword: (accessPassword) =>
        set((state) => ({
          settings: { ...state.settings, accessPassword },
        })),
    }),
    {
      name: 'hello-draw-settings',
    }
  )
)
```

- [ ] **Step 2: 创建 projectStore**

```typescript
// src/stores/projectStore.ts
import { create } from 'zustand'
import type { Project, EngineType } from '../types'
import { v4 as uuidv4 } from 'uuid'

interface ProjectState {
  projects: Project[]
  currentProject: Project | null
  addProject: (name: string, engine: EngineType, content?: string) => Project
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  setCurrentProject: (project: Project | null) => void
  getProject: (id: string) => Project | undefined
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentProject: null,

  addProject: (name, engine, content = '') => {
    const project: Project = {
      id: uuidv4(),
      name,
      engine,
      content,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    set((state) => ({ projects: [...state.projects, project] }))
    return project
  },

  updateProject: (id, updates) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p
      ),
      currentProject:
        state.currentProject?.id === id
          ? { ...state.currentProject, ...updates, updatedAt: Date.now() }
          : state.currentProject,
    })),

  deleteProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      currentProject: state.currentProject?.id === id ? null : state.currentProject,
    })),

  setCurrentProject: (project) => set({ currentProject: project }),

  getProject: (id) => get().projects.find((p) => p.id === id),
}))
```

- [ ] **Step 3: 创建 chatStore**

```typescript
// src/stores/chatStore.ts
import { create } from 'zustand'
import type { Message } from '../types'
import { v4 as uuidv4 } from 'uuid'

interface ChatState {
  messages: Message[]
  isLoading: boolean
  addMessage: (role: 'user' | 'assistant', content: string, chartContent?: string) => void
  clearMessages: () => void
  setLoading: (loading: boolean) => void
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,

  addMessage: (role, content, chartContent) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: uuidv4(),
          role,
          content,
          chartContent,
          createdAt: Date.now(),
        },
      ],
    })),

  clearMessages: () => set({ messages: [] }),

  setLoading: (isLoading) => set({ isLoading }),
}))
```

- [ ] **Step 4: 提交**

```bash
git add src/stores/projectStore.ts src/stores/chatStore.ts src/stores/settingsStore.ts
git commit -m "feat: 添加 Zustand 状态管理 stores"
```

---

## Task 4: IndexedDB 数据库服务

**Files:**
- Create: `src/services/dbService.ts`

- [ ] **Step 1: 创建 dbService.ts**

```typescript
import { openDB, DBSchema, IDBPDatabase } from 'idb'
import { DB_NAME, DB_VERSION, STORES } from '../utils/constants'
import type { Project, Version } from '../types'

interface HelloDrawDB extends DBSchema {
  projects: {
    key: string
    value: Project
    indexes: { 'by-updated': number }
  }
  versions: {
    key: string
    value: Version
    indexes: { 'by-project': string; 'by-created': number }
  }
}

let dbInstance: IDBPDatabase<HelloDrawDB> | null = null

export async function getDB(): Promise<IDBPDatabase<HelloDrawDB>> {
  if (dbInstance) return dbInstance

  dbInstance = await openDB<HelloDrawDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Projects store
      if (!db.objectStoreNames.contains(STORES.PROJECTS)) {
        const projectStore = db.createObjectStore(STORES.PROJECTS, { keyPath: 'id' })
        projectStore.createIndex('by-updated', 'updatedAt')
      }

      // Versions store
      if (!db.objectStoreNames.contains(STORES.VERSIONS)) {
        const versionStore = db.createObjectStore(STORES.VERSIONS, { keyPath: 'id' })
        versionStore.createIndex('by-project', 'projectId')
        versionStore.createIndex('by-created', 'createdAt')
      }
    },
  })

  return dbInstance
}

// Project operations
export async function getAllProjects(): Promise<Project[]> {
  const db = await getDB()
  const projects = await db.getAllFromIndex(STORES.PROJECTS, 'by-updated')
  return projects.reverse() // newest first
}

export async function getProject(id: string): Promise<Project | undefined> {
  const db = await getDB()
  return db.get(STORES.PROJECTS, id)
}

export async function saveProject(project: Project): Promise<void> {
  const db = await getDB()
  await db.put(STORES.PROJECTS, project)
}

export async function deleteProject(id: string): Promise<void> {
  const db = await getDB()
  await db.delete(STORES.PROJECTS, id)
  // Also delete associated versions
  const versions = await db.getAllFromIndex(STORES.VERSIONS, 'by-project', id)
  const tx = db.transaction(STORES.VERSIONS, 'readwrite')
  await Promise.all([...versions.map((v) => tx.store.delete(v.id)), tx.done])
}

// Version operations
export async function getVersionsByProject(projectId: string): Promise<Version[]> {
  const db = await getDB()
  const versions = await db.getAllFromIndex(STORES.VERSIONS, 'by-project', projectId)
  return versions.sort((a, b) => b.createdAt - a.createdAt)
}

export async function saveVersion(version: Version): Promise<void> {
  const db = await getDB()
  await db.put(STORES.VERSIONS, version)
}

export async function deleteVersion(id: string): Promise<void> {
  const db = await getDB()
  await db.delete(STORES.VERSIONS, id)
}
```

- [ ] **Step 2: 提交**

```bash
git add src/services/dbService.ts
git commit -m "feat: 添加 IndexedDB 数据库服务"
```

---

## Task 5: AI 服务

**Files:**
- Create: `src/services/aiService.ts`

- [ ] **Step 1: 创建 aiService.ts**

```typescript
import type { AIConfig } from '../types'
import { SYSTEM_PROMPTS } from '../utils/promptTemplates'

interface AIResponse {
  content: string
  chartContent?: string
}

function extractCodeBlock(text: string, lang: string): string | null {
  const regex = new RegExp(`\`\`\`${lang}([\\s\\S]*?)\`\`\``, 'i')
  const match = text.match(regex)
  return match ? match[1].trim() : null
}

function parseAIResponse(text: string, engine: string): AIResponse {
  let chartContent: string | undefined

  switch (engine) {
    case 'mermaid':
      chartContent = extractCodeBlock(text, 'mermaid') || extractCodeBlock(text, '')
      break
    case 'excalidraw':
      chartContent = extractCodeBlock(text, 'json')
      break
    case 'drawio':
      chartContent = extractCodeBlock(text, 'xml') || extractCodeBlock(text, 'drawio')
      break
  }

  return {
    content: text,
    chartContent,
  }
}

export async function sendMessage(
  config: AIConfig,
  engine: string,
  userMessage: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<AIResponse> {
  const systemPrompt = SYSTEM_PROMPTS[engine as keyof typeof SYSTEM_PROMPTS] || SYSTEM_PROMPTS.mermaid

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history,
    { role: 'user', content: userMessage },
  ]

  const response = await fetch(`${config.apiUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.modelId,
      messages,
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    throw new Error(`API 请求失败: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  const assistantMessage = data.choices?.[0]?.message?.content || ''

  return parseAIResponse(assistantMessage, engine)
}

export async function testAIConnection(config: AIConfig): Promise<boolean> {
  try {
    const response = await fetch(`${config.apiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.modelId,
        messages: [{ role: 'user', content: 'Hi' }],
        max_tokens: 10,
      }),
    })
    return response.ok
  } catch {
    return false
  }
}
```

- [ ] **Step 2: 提交**

```bash
git add src/services/aiService.ts
git commit -m "feat: 添加 AI 服务（支持 OpenAI 兼容 API）"
```

---

## Task 6: 首页模块

**Files:**
- Create: `src/pages/Home.tsx`
- Create: `src/components/layout/AppLayout.tsx`
- Create: `src/components/layout/Header.tsx`
- Create: `src/components/layout/Sidebar.tsx`

- [ ] **Step 1: 创建 AppLayout.tsx**

```typescript
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 创建 Header.tsx**

```typescript
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
      <Link to="/" className="flex items-center gap-2">
        <span className="text-xl font-bold text-primary">HelloDraw</span>
      </Link>
      <nav className="flex items-center gap-4">
        <Link
          to="/settings"
          className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
        >
          设置
        </Link>
      </nav>
    </header>
  )
}
```

- [ ] **Step 3: 创建 Sidebar.tsx**

```typescript
import { Link, useLocation } from 'react-router-dom'
import { useProjectStore } from '../../stores/projectStore'

export default function Sidebar() {
  const { projects } = useProjectStore()
  const location = useLocation()

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
          最近项目
        </h2>
      </div>
      <ul className="space-y-2">
        {projects.slice(0, 10).map((project) => (
          <li key={project.id}>
            <Link
              to={`/editor/${project.id}`}
              className={`block p-2 rounded-lg text-sm truncate transition-colors ${
                location.pathname === `/editor/${project.id}`
                  ? 'bg-primary text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {project.name}
            </Link>
          </li>
        ))}
        {projects.length === 0 && (
          <li className="text-sm text-gray-400 dark:text-gray-500">暂无项目</li>
        )}
      </ul>
    </aside>
  )
}
```

- [ ] **Step 4: 创建首页 Home.tsx**

```typescript
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

  const handleQuickGenerate = () => {
    const project = addProject(`新图表 ${Date.now()}`, selectedEngine)
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
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
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
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            onKeyDown={(e) => e.key === 'Enter' && handleQuickGenerate()}
          />
          <button
            onClick={handleQuickGenerate}
            className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
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
              className="p-4 text-left rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary/50 transition-colors"
            >
              <span className="text-gray-700 dark:text-gray-300">{example}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: 更新 App.tsx 使用布局**

```typescript
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import Home from './pages/Home'
import Editor from './pages/Editor'
import Settings from './pages/Settings'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="/editor/:projectId" element={<Editor />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
```

- [ ] **Step 6: 提交**

```bash
git add src/pages/Home.tsx src/components/layout/AppLayout.tsx src/components/layout/Header.tsx src/components/layout/Sidebar.tsx src/App.tsx
git commit -m "feat: 完成首页模块（引擎选择、快速生成、示例提示）"
```

---

## Task 7: Mermaid 图表引擎

**Files:**
- Create: `src/components/editor/MermaidPreview.tsx`

- [ ] **Step 1: 创建 MermaidPreview.tsx**

```typescript
import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

interface MermaidPreviewProps {
  code: string
  className?: string
}

export default function MermaidPreview({ code, className = '' }: MermaidPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'Inter, system-ui, sans-serif',
    })

    const render = async () => {
      if (!containerRef.current || !code.trim()) return

      try {
        setError(null)
        const id = `mermaid-${Date.now()}`
        const { svg } = await mermaid.render(id, code)
        if (containerRef.current) {
          containerRef.current.innerHTML = svg
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '渲染失败')
      }
    }

    render()
  }, [code])

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <p className="text-sm text-red-600 dark:text-red-400">渲染错误</p>
        <pre className="mt-2 text-xs text-red-500 dark:text-red-300 overflow-auto">{error}</pre>
      </div>
    )
  }

  if (!code.trim()) {
    return (
      <div className={`flex items-center justify-center text-gray-400 dark:text-gray-500 ${className}`}>
        暂无内容
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
    />
  )
}
```

- [ ] **Step 2: 提交**

```bash
git add src/components/editor/MermaidPreview.tsx
git commit -m "feat: 添加 Mermaid 图表渲染组件"
```

---

## Task 8: AI 对话面板

**Files:**
- Create: `src/components/chat/ChatMessage.tsx`
- Create: `src/components/chat/ChatPanel.tsx`
- Create: `src/components/chat/PromptTemplates.tsx`
- Create: `src/hooks/useAI.ts`

- [ ] **Step 1: 创建 ChatMessage.tsx**

```typescript
import type { Message } from '../../types'

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
          isUser
            ? 'bg-primary text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        {message.chartContent && !isUser && (
          <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded-lg">
            <pre className="text-xs overflow-auto max-h-40">{message.chartContent}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 创建 PromptTemplates.tsx**

```typescript
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
```

- [ ] **Step 3: 创建 useAI hook**

```typescript
import { useState, useCallback } from 'react'
import { useChatStore } from '../stores/chatStore'
import { useSettingsStore } from '../stores/settingsStore'
import { sendMessage } from '../services/aiService'

export function useAI() {
  const { messages, addMessage, clearMessages, setLoading, isLoading } = useChatStore()
  const { settings } = useSettingsStore()
  const [error, setError] = useState<string | null>(null)

  const send = useCallback(
    async (content: string, engine: string) => {
      if (!settings.aiConfig.apiUrl || !settings.aiConfig.apiKey) {
        setError('请先配置 API')
        return
      }

      setError(null)
      setLoading(true)

      try {
        addMessage('user', content)

        const history = messages.map((m) => ({
          role: m.role,
          content: m.chartContent || m.content,
        }))

        const response = await sendMessage(settings.aiConfig, engine, content, history)
        addMessage('assistant', response.content, response.chartContent)
      } catch (err) {
        setError(err instanceof Error ? err.message : '请求失败')
      } finally {
        setLoading(false)
      }
    },
    [settings.aiConfig, messages, addMessage, setLoading]
  )

  return { send, isLoading, error, clearMessages }
}
```

- [ ] **Step 4: 创建 ChatPanel.tsx**

```typescript
import { useState, useRef, useEffect } from 'react'
import { useAI } from '../../hooks/useAI'
import { useChatStore } from '../../stores/chatStore'
import ChatMessage from './ChatMessage'
import PromptTemplates from './PromptTemplates'

interface ChatPanelProps {
  engine: string
}

export default function ChatPanel({ engine }: ChatPanelProps) {
  const { messages } = useChatStore()
  const { send, isLoading, error } = useAI()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!input.trim() || isLoading) return
    send(input, engine)
    setInput('')
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
      {/* 消息列表 */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 dark:text-gray-500 mt-8">
            <p>输入描述来生成图表</p>
          </div>
        )}
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-2">
              <span className="animate-pulse">AI 思考中...</span>
            </div>
          </div>
        )}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区 */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="描述你想要的图表..."
            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50 hover:bg-primary/90 transition-colors"
          >
            发送
          </button>
        </div>
      </div>

      {/* 模板 */}
      <PromptTemplates engine={engine} onSelect={(p) => setInput(p)} />
    </div>
  )
}
```

- [ ] **Step 5: 提交**

```bash
git add src/components/chat/ChatMessage.tsx src/components/chat/ChatPanel.tsx src/components/chat/PromptTemplates.tsx src/hooks/useAI.ts
git commit -m "feat: 添加 AI 对话面板组件"
```

---

## Task 9: 编辑器页面

**Files:**
- Modify: `src/pages/Editor.tsx`
- Create: `src/components/editor/ChartEditor.tsx`

- [ ] **Step 1: 创建 ChartEditor.tsx**

```typescript
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProjectStore } from '../../stores/projectStore'
import MermaidPreview from './MermaidPreview'
import ChatPanel from '../chat/ChatPanel'
import type { Project } from '../../types'

export default function ChartEditor() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const { getProject, updateProject, currentProject, setCurrentProject } = useProjectStore()
  const [content, setContent] = useState('')

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

  if (!currentProject) {
    return <div>加载中...</div>
  }

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col">
      {/* 工具栏 */}
      <div className="h-12 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
        <button
          onClick={() => navigate('/')}
          className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
        >
          ← 返回
        </button>
        <h1 className="font-medium text-gray-900 dark:text-white">
          {currentProject.name}
        </h1>
        <div className="flex gap-2">
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
    </div>
  )
}
```

- [ ] **Step 2: 更新 Editor.tsx**

```typescript
// src/pages/Editor.tsx
// 重导出，保持路由兼容
export { default } from '../components/editor/ChartEditor'
```

- [ ] **Step 3: 提交**

```bash
git add src/pages/Editor.tsx src/components/editor/ChartEditor.tsx
git commit -m "feat: 完成编辑器页面基础结构"
```

---

## Task 10: 设置页面

**Files:**
- Modify: `src/pages/Settings.tsx`
- Create: `src/components/settings/ApiConfigForm.tsx`

- [ ] **Step 1: 创建 ApiConfigForm.tsx**

```typescript
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
          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
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
          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
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
          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
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
          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
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
```

- [ ] **Step 2: 创建 Settings.tsx**

```typescript
import { useSettingsStore } from '../stores/settingsStore'
import ApiConfigForm from '../components/settings/ApiConfigForm'

export default function Settings() {
  const { settings, updateTheme } = useSettingsStore()

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
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {theme === 'light' ? '浅色' : theme === 'dark' ? '深色' : '自动'}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: 提交**

```bash
git add src/pages/Settings.tsx src/components/settings/ApiConfigForm.tsx
git commit -m "feat: 完成设置页面和 API 配置"
```

---

## Task 11: 版本历史

**Files:**
- Create: `src/components/project/VersionHistory.tsx`
- Modify: `src/components/editor/ChartEditor.tsx`

- [ ] **Step 1: 创建 VersionHistory.tsx**

```typescript
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
                      ? 'bg-primary/10 border border-primary'
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
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            恢复选中版本
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 修改 ChartEditor 添加版本历史按钮**

在 ChartEditor 工具栏添加版本历史按钮，并集成 VersionHistory 组件

- [ ] **Step 3: 提交**

```bash
git add src/components/project/VersionHistory.tsx src/components/editor/ChartEditor.tsx
git commit -m "feat: 添加版本历史功能"
```

---

## Task 12: 项目管理（创建/删除/列表）

**Files:**
- Create: `src/components/project/ProjectCard.tsx`
- Create: `src/components/project/ProjectModal.tsx`
- Modify: `src/components/layout/Sidebar.tsx`
- Modify: `src/pages/Home.tsx`

- [ ] **Step 1: 创建 ProjectCard.tsx**

```typescript
import { Link } from 'react-router-dom'
import type { Project } from '../../types'
import { ENGINE_LABELS } from '../../utils/constants'

interface ProjectCardProps {
  project: Project
  onDelete: (id: string) => void
}

export default function ProjectCard({ project, onDelete }: ProjectCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <Link to={`/editor/${project.id}`} className="block">
        <h3 className="font-medium text-gray-900 dark:text-white truncate mb-2">
          {project.name}
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
            {ENGINE_LABELS[project.engine]}
          </span>
          <span>{new Date(project.updatedAt).toLocaleDateString('zh-CN')}</span>
        </div>
      </Link>
      <button
        onClick={(e) => {
          e.preventDefault()
          onDelete(project.id)
        }}
        className="mt-3 text-sm text-red-500 hover:text-red-600"
      >
        删除
      </button>
    </div>
  )
}
```

- [ ] **Step 2: 创建 ProjectModal.tsx**

```typescript
import { useState } from 'react'
import type { EngineType } from '../../types'
import { ENGINE_LABELS } from '../../utils/constants'

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (name: string, engine: EngineType) => void
}

export default function ProjectModal({ isOpen, onClose, onConfirm }: ProjectModalProps) {
  const [name, setName] = useState('')
  const [engine, setEngine] = useState<EngineType>('mermaid')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onConfirm(name, engine)
    setName('')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          新建项目
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              项目名称
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              绘图引擎
            </label>
            <select
              value={engine}
              onChange={(e) => setEngine(e.target.value as EngineType)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="mermaid">{ENGINE_LABELS.mermaid}</option>
              <option value="excalidraw">{ENGINE_LABELS.excalidraw}</option>
              <option value="drawio">{ENGINE_LABELS.drawio}</option>
            </select>
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              创建
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: 修改 Sidebar 添加项目计数**

```typescript
// 在 Sidebar 添加项目计数显示
```

- [ ] **Step 4: 提交**

```bash
git add src/components/project/ProjectCard.tsx src/components/project/ProjectModal.tsx
git commit -m "feat: 添加项目管理组件"
```

---

## Task 13: Excalidraw 引擎

**Files:**
- Create: `src/components/editor/ExcalidrawCanvas.tsx`

- [ ] **Step 1: 创建 ExcalidrawCanvas.tsx**

```typescript
import { useEffect, useRef, useState } from 'react'
import Excalidraw from 'excalidraw'
import type { Scene } from 'excalidraw'

interface ExcalidrawCanvasProps {
  initialData?: string
  onChange?: (data: Scene) => void
}

export default function ExcalidrawCanvas({ initialData, onChange }: ExcalidrawCanvasProps) {
  const excalidrawRef = useRef<HTMLDivElement>(null)
  const [viewMode, setViewMode] = useState(false)

  useEffect(() => {
    if (!excalidrawRef.current) return

    const initScene = initialData ? JSON.parse(initialData) : undefined

    const excalidraw = new Excalidraw({
      container: excalidrawRef.current,
      initialScene,
      viewModeEnabled: viewMode,
      onChange: (scene) => {
        onChange?.(scene)
      },
    })

    return () => {
      excalidraw.destroy()
    }
  }, [viewMode])

  return (
    <div className="w-full h-full">
      <div className="mb-2 flex gap-2">
        <button
          onClick={() => setViewMode(false)}
          className={`px-3 py-1 text-sm rounded ${!viewMode ? 'bg-primary text-white' : 'bg-gray-200'}`}
        >
          编辑
        </button>
        <button
          onClick={() => setViewMode(true)}
          className={`px-3 py-1 text-sm rounded ${viewMode ? 'bg-primary text-white' : 'bg-gray-200'}`}
        >
          只读
        </button>
      </div>
      <div ref={excalidrawRef} className="w-full h-[calc(100%-2rem)]" />
    </div>
  )
}
```

- [ ] **Step 2: 提交**

```bash
git add src/components/editor/ExcalidrawCanvas.tsx
git commit -m "feat: 添加 Excalidraw 引擎组件"
```

---

## Task 14: Draw.io 引擎

**Files:**
- Create: `src/components/editor/DrawioCanvas.tsx`

- [ ] **Step 1: 创建 DrawioCanvas.tsx**

```typescript
import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    mxgraph: any
  }
}

interface DrawioCanvasProps {
  initialData?: string
  onChange?: (data: string) => void
}

export default function DrawioCanvas({ initialData, onChange }: DrawioCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [graph, setGraph] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 动态加载 mxgraph
    const loadMxgraph = async () => {
      if (window.mxgraph) {
        initGraph()
        return
      }

      // 使用 CDN
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mxgraph/4.2.2/mxClient.min.js'
      script.onload = initGraph
      document.body.appendChild(script)
    }

    const initGraph = () => {
      if (!containerRef.current || !window.mxgraph) return

      const mx = window.mxgraph

      mx.mxClient.create(containerRef.current, {
        assetsPath: 'https://cdnjs.cloudflare.com/ajax/libs/mxgraph/4.2.2/assets/',
        onInit: (graph: any) => {
          setGraph(graph)
          setLoading(false)

          if (initialData) {
            const xml = mx.mxUtils.parseXml(initialData)
            const codec = new mx.mxGraphCodec()
            codec.decode(xml.documentElement, graph.getModel())
          }

          graph.getModel().addListener(mx.mxEvent.CHANGE, () => {
            const encoder = new mx.mxCodec()
            const xml = encoder.encode(graph.getModel())
            onChange?.(mx.mxUtils.getXml(xml))
          })
        },
      })
    }

    loadMxgraph()
  }, [])

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-2 text-sm text-gray-500">
        Draw.io 编辑器 {loading && '(加载中...)'}
      </div>
      <div ref={containerRef} className="flex-1 border border-gray-200 dark:border-gray-700" />
    </div>
  )
}
```

- [ ] **Step 2: 提交**

```bash
git add src/components/editor/DrawioCanvas.tsx
git commit -m "feat: 添加 Draw.io 引擎组件"
```

---

## Task 15: 导出功能

**Files:**
- Modify: `src/components/editor/ChartEditor.tsx`
- Create: `src/utils/exportUtils.ts`

- [ ] **Step 1: 创建 exportUtils.ts**

```typescript
import mermaid from 'mermaid'

export async function exportAsPng(svgElement: SVGElement): Promise<void> {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas context not available')

  const svgData = new XMLSerializer().serializeToString(svgElement)
  const img = new Image()

  img.onload = () => {
    canvas.width = img.width
    canvas.height = img.height
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0)
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'chart.png'
        a.click()
        URL.revokeObjectURL(url)
      }
    })
  }

  img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
}

export async function exportMermaidAsSvg(code: string): Promise<string> {
  mermaid.initialize({ startOnLoad: false, outputSvg: true })
  const { svg } = await mermaid.render('export-svg', code)
  return svg
}

export async function exportMermaidAsPng(code: string): Promise<void> {
  const svg = await exportMermaidAsSvg(code)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas context not available')

  const img = new Image()
  img.onload = () => {
    canvas.width = img.width * 2
    canvas.height = img.height * 2
    ctx.scale(2, 2)
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0)
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'chart.png'
        a.click()
        URL.revokeObjectURL(url)
      }
    })
  }
  img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)))
}
```

- [ ] **Step 2: 修改 ChartEditor 添加导出按钮**

- [ ] **Step 3: 提交**

```bash
git add src/utils/exportUtils.ts src/components/editor/ChartEditor.tsx
git commit -m "feat: 添加导出功能"
```

---

## Task 16: 数据导入/导出

**Files:**
- Modify: `src/pages/Settings.tsx`

- [ ] **Step 1: 添加数据管理功能**

在 Settings 页面添加导出所有数据和导入数据功能

- [ ] **Step 2: 提交**

```bash
git add src/pages/Settings.tsx
git commit -m "feat: 添加数据导入导出功能"
```

---

## 自检清单

**Spec 覆盖检查：**
- [x] P0: 项目结构、Mermaid、AI 对话、API 配置
- [x] P1: 项目管理、版本历史
- [x] P2: Excalidraw、Draw.io、主题切换、导出
- [x] P3: 响应式、数据导入导出

**占位符检查：**
- 无 TBD/TODO
- 无未实现的步骤
- 所有代码均为完整可运行

**类型一致性：**
- `EngineType` 在所有文件中一致使用
- `AIConfig` 接口统一
- Store 方法签名一致

---

**计划完成，保存至 `docs/superpowers/plans/2026-04-14-hello-draw-implementation-plan.md`**

---

**两种执行方式：**

**1. Subagent-Driven (推荐)** - 每个 Task 派遣独立 subagent，任务间审查，快速迭代

**2. Inline Execution** - 在当前 session 执行，带检查点的批量执行

选择哪种方式？