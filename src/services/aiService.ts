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
      chartContent = extractCodeBlock(text, 'mermaid') || extractCodeBlock(text, '') || undefined
      break
    case 'excalidraw':
      chartContent = extractCodeBlock(text, 'json') || undefined
      break
    case 'drawio':
      chartContent = extractCodeBlock(text, 'xml') || extractCodeBlock(text, 'drawio') || undefined
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
