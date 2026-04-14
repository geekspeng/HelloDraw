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
            ? 'bg-blue-600 text-white'
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
