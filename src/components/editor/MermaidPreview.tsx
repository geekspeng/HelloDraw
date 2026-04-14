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
