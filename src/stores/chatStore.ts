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
