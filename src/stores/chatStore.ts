import { create } from 'zustand'
import type { Message } from '../types'
import { v4 as uuidv4 } from 'uuid'

interface ChatState {
  messages: Message[]
  isLoading: boolean
  projectId: string | null
  addMessage: (role: 'user' | 'assistant', content: string, chartContent?: string) => void
  clearMessages: () => void
  setLoading: (loading: boolean) => void
  setProjectId: (projectId: string | null) => void
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,
  projectId: null,

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

  setProjectId: (projectId) =>
    set((state) => {
      // 切换项目时清空消息
      if (projectId !== state.projectId) {
        return { projectId, messages: [] }
      }
      return { projectId }
    }),
}))
