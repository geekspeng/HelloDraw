import { useState, useCallback, useRef } from 'react'
import { useChatStore } from '../stores/chatStore'
import { useSettingsStore } from '../stores/settingsStore'
import { sendMessage } from '../services/aiService'

export function useAI() {
  const addMessage = useChatStore((s) => s.addMessage)
  const setLoading = useChatStore((s) => s.setLoading)
  const isLoading = useChatStore((s) => s.isLoading)
  const messagesRef = useRef(useChatStore.getState().messages)
  const { settings } = useSettingsStore()
  const [error, setError] = useState<string | null>(null)

  // 保持 messagesRef 与 store 同步
  useChatStore.subscribe((state) => {
    messagesRef.current = state.messages
  })

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

        // 使用 ref 获取最新的消息列表
        const history = messagesRef.current.map((m) => ({
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
    [settings.aiConfig, addMessage, setLoading]
  )

  return { send, isLoading, error }
}
