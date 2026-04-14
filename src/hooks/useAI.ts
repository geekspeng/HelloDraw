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
