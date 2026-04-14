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
