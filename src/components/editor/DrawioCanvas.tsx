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
        onInit: (graphInstance: any) => {
          setGraph(graphInstance)
          setLoading(false)

          if (initialData) {
            try {
              const xml = mx.mxUtils.parseXml(initialData)
              const codec = new mx.mxGraphCodec()
              codec.decode(xml.documentElement, graphInstance.getModel())
            } catch (e) {
              // ignore parse errors
            }
          }

          graphInstance.getModel().addListener(mx.mxEvent.CHANGE, () => {
            const encoder = new mx.mxCodec()
            const xml = encoder.encode(graphInstance.getModel())
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
