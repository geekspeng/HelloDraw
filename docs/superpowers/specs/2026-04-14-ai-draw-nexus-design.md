# HelloDraw 项目设计规格

## 一、项目概述

### 1.1 项目名称
HelloDraw（AI 图表生成平台）

### 1.2 核心功能
通过自然语言描述生成专业可视化图表，支持多种绘图引擎和多种 AI 模型提供商。

### 1.3 目标用户
- 需要快速创建流程图、架构图、时序图的技术人员
- 需要可视化展示的团队和个人
- 希望用自然语言驱动图表创作的用户

---

## 二、技术架构

### 2.1 前端技术栈
- **框架**: React 18 + Vite
- **路由**: React Router v6
- **状态管理**: Zustand（轻量级）
- **样式**: Tailwind CSS
- **存储**: IndexedDB（项目数据）+ localStorage（用户配置）
- **图表渲染**:
  - Mermaid（流程图、时序图、类图等）
  - Excalidraw（手绘风格图表）
  - Draw.io（专业复杂图表）

### 2.2 AI 模型支持
支持所有兼容 OpenAI ChatML 格式的 API：
- **国产**: 智谱 GLM、MiniMax、海螺、百度文心、阿里通义、腾讯混元等
- **海外**: OpenAI GPT、Anthropic Claude（需翻墙）

### 2.3 数据存储
| 数据类型 | 存储位置 | 说明 |
|---------|---------|------|
| 项目数据 | IndexedDB | 图表内容、版本历史 |
| API Key | localStorage | 用户提供的密钥 |
| API 配置 | localStorage | API地址、模型选择 |
| 访问密码 | localStorage | 访问控制 |

---

## 三、功能模块

### 3.1 首页模块
- 三种绘图引擎选择卡片（Mermaid / Excalidraw / Draw.io）
- 快速输入框（自然语言描述图表需求）
- 一键生成按钮
- 最近项目列表（快捷入口）

### 3.2 AI 对话模块
- 聊天式对话界面
- 支持多轮对话修改图表
- 预设提示词模板（流程图、架构图、时序图、思维导图等）
- 消息类型：用户消息、AI响应、图表展示

### 3.3 绘图引擎模块

#### Mermaid 引擎
- 代码编辑区（支持语法高亮）
- 实时预览区
- 支持图表类型：flowchart、sequenceDiagram、classDiagram、erDiagram、gantt、pie、mindmap
- 一键复制代码

#### Excalidraw 引擎
- 手绘风格画布
- 工具栏：选择、矩形、椭圆、箭头、文字、自由绘制
- 导出为 PNG/SVG

#### Draw.io 引擎
- 专业图表编辑
- 丰富图形库
- 模板支持
- 导出为 PNG/SVG/XML

### 3.4 项目管理模块
- 项目列表（卡片/列表视图切换）
- 新建项目（选择引擎、输入名称）
- 编辑项目
- 删除项目（确认对话框）
- 搜索项目

### 3.5 版本历史模块
- 版本列表（时间线展示）
- 版本预览
- 一键恢复历史版本
- 版本对比（可选）

### 3.6 设置模块
- **API 配置**:
  - 选择模型提供商（GLM/MiniMax/OpenAI/自定义）
  - API 地址输入
  - API Key 输入（密码框）
  - 模型 ID 输入
  - 连接测试按钮
- **访问密码**: 设置/取消访问密码
- **主题切换**: 浅色/深色/自动
- **导出/导入数据**: 备份和恢复

### 3.7 多模态输入（Mock 模式）
由于 API Key 由用户提供，多模态功能（文档解析、图片识别）在此版本中提供 Mock 展示：
- 文档上传 → 显示"功能示例"提示
- 图片上传 → 显示"功能示例"提示
- 链接解析 → 显示"功能示例"提示

---

## 四、界面布局

### 4.1 整体布局
```
┌─────────────────────────────────────────────────────┐
│  Header: Logo + 导航 + 设置入口                        │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│ Sidebar  │           Main Content Area              │
│ 项目列表  │    （首页/编辑器/设置，根据路由显示）        │
│          │                                          │
│          │                                          │
└──────────┴──────────────────────────────────────────┘
```

### 4.2 编辑器布局
```
┌─────────────────────────────────────────────────────┐
│  Toolbar: 导出 + 历史记录 + 返回项目列表               │
├─────────────────────────┬───────────────────────────┤
│                         │                           │
│    Canvas Area          │    Chat Panel              │
│    图表画布/预览         │    AI对话区               │
│                         │                           │
│                         │                           │
├─────────────────────────┴───────────────────────────┤
│  状态栏: 当前引擎 + 保存状态 + API状态                  │
└─────────────────────────────────────────────────────┘
```

### 4.3 响应式设计
- **桌面端**: 完整侧边栏 + 双栏编辑器
- **平板端**: 可折叠侧边栏 + 单栏编辑器
- **移动端**: 底部导航 + 全屏编辑器（简化工具栏）

---

## 五、核心流程

### 5.1 首次使用流程
1. 用户打开应用 → 首页
2. 引导用户完成 API 配置（弹窗提示）
3. 用户输入 API 配置并保存
4. 开始使用

### 5.2 创建图表流程
1. 选择绘图引擎（首页/项目内）
2. 输入自然语言描述（如"画一个用户登录流程图"）
3. 点击生成 → AI 返回图表代码
4. 渲染展示图表
5. 自动保存为新项目

### 5.3 编辑图表流程
1. 进入项目 → 打开编辑器
2. 在对话面板输入修改指令
3. AI 理解上下文并返回修改后的图表
4. 自动更新并保存版本

---

## 六、API 设计（前端调用）

### 6.1 模型配置接口
```typescript
interface AIConfig {
  provider: 'glm' | 'minimax' | 'openai' | 'custom';
  apiUrl: string;
  apiKey: string;
  modelId: string;
}
```

### 6.2 AI 调用格式（OpenAI 兼容）
```typescript
// 请求
POST {apiUrl}/chat/completions
Headers: {
  "Content-Type": "application/json",
  "Authorization": "Bearer {apiKey}"
}
Body: {
  "model": "{modelId}",
  "messages": [
    {"role": "system", "content": "你是一个图表生成助手..."},
    {"role": "user", "content": "画一个用户登录流程图"}
  ]
}

// 响应
{
  "choices": [{
    "message": {
      "content": "```mermaid\nflowchart TD\nA[开始] --> B[输入用户名]\n..."  }
  }]
}
```

### 6.3 Prompt 模板
```typescript
const promptTemplates = {
  mermaid: `你是一个专业的Mermaid图表生成助手。用户输入图表描述，你返回Mermaid代码。

要求：
1. 只返回Mermaid代码，使用```mermaid代码块包裹
2. 代码要符合Mermaid语法
3. 图表要清晰表达用户需求

示例输出：
\`\`\`mermaid
flowchart TD
A[开始] --> B[输入用户名]
\`\`\`

用户需求：{userInput}`,

  excalidraw: `你是一个Excalidraw图表生成助手...`,

  drawio: `你是一个Draw.io图表生成助手...`
};
```

---

## 七、数据模型

### 7.1 项目 (Project)
```typescript
interface Project {
  id: string;
  name: string;
  engine: 'mermaid' | 'excalidraw' | 'drawio';
  content: string;  // 图表代码/数据
  createdAt: number;
  updatedAt: number;
}
```

### 7.2 版本历史 (Version)
```typescript
interface Version {
  id: string;
  projectId: string;
  content: string;
  createdAt: number;
}
```

### 7.3 消息 (Message)
```typescript
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  chartContent?: string;  // 图表代码（AI回复时）
  createdAt: number;
}
```

---

## 八、关键组件

| 组件 | 职责 |
|-----|------|
| `AppLayout` | 整体布局，包含侧边栏和内容区 |
| `ProjectList` | 项目列表展示和管理 |
| `ChartEditor` | 图表编辑器，根据引擎类型渲染不同画布 |
| `MermaidPreview` | Mermaid 图表渲染 |
| `ExcalidrawCanvas` | Excalidraw 画布 |
| `DrawioCanvas` | Draw.io 画布（使用 embed 模式） |
| `ChatPanel` | AI 对话面板 |
| `SettingsPanel` | 设置面板 |
| `ApiConfigModal` | API 配置弹窗 |

---

## 九、第三方库依赖

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "zustand": "^4.4.0",
    "mermaid": "^10.6.0",
    "excalidraw": "^0.16.0",
    "idb": "^7.1.0",
    "@hello-pangea/dnd": "^16.5.0"
  }
}
```

**说明：**
- Draw.io 使用官方提供的 embed embedder 或 mxgraph library
- Excalidraw 使用官方 React 封装包

---

## 十、实现优先级

### P0（核心功能）
1. 项目基础结构搭建（React + Vite + 路由 + 布局）
2. Mermaid 引擎集成（渲染 + 编辑）
3. AI 对话功能（支持 GLM/MiniMax）
4. API 配置和存储

### P1（重要功能）
5. 项目管理（创建、编辑、删除、列表）
6. 版本历史
7. 首页快速生成

### P2（增强功能）
8. Excalidraw 引擎
9. Draw.io 引擎
10. 主题切换
11. 导出功能

### P3（优化功能）
12. 响应式适配
13. 数据导入/导出
14. 预设模板

---

## 十一、目录结构

```
hello-draw/
├── public/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Header.tsx
│   │   ├── editor/
│   │   │   ├── ChartEditor.tsx
│   │   │   ├── MermaidPreview.tsx
│   │   │   ├── ExcalidrawCanvas.tsx
│   │   │   └── DrawioCanvas.tsx
│   │   ├── chat/
│   │   │   ├── ChatPanel.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   └── PromptTemplates.tsx
│   │   ├── project/
│   │   │   ├── ProjectList.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   └── ProjectModal.tsx
│   │   ├── settings/
│   │   │   ├── SettingsPanel.tsx
│   │   │   └── ApiConfigForm.tsx
│   │   └── common/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       └── Modal.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Editor.tsx
│   │   └── Settings.tsx
│   ├── stores/
│   │   ├── projectStore.ts
│   │   ├── chatStore.ts
│   │   └── settingsStore.ts
│   ├── services/
│   │   ├── aiService.ts
│   │   └── dbService.ts
│   ├── hooks/
│   │   ├── useAI.ts
│   │   └── useProject.ts
│   ├── utils/
│   │   ├── promptTemplates.ts
│   │   └── constants.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```
