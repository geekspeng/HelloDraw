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
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    let destroyed = false

    const loadMxgraph = async () => {
      if (window.mxgraph) {
        initGraph()
        return
      }

      // 动态加载 mxgraph
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mxgraph/4.2.2/mxClient.min.js'

      const timeout = setTimeout(() => {
        if (!destroyed && status === 'loading') {
          setStatus('error')
          setErrorMsg('mxgraph 加载超时，请检查网络连接')
        }
      }, 15000)

      script.onload = () => {
        clearTimeout(timeout)
        if (!destroyed) initGraph()
      }

      script.onerror = () => {
        clearTimeout(timeout)
        if (!destroyed) {
          setStatus('error')
          setErrorMsg('mxgraph 加载失败，CDN 不可达')
        }
      }

      document.body.appendChild(script)
    }

    const initGraph = () => {
      if (destroyed || !container || !window.mxgraph) return

      const mx = window.mxgraph

      try {
        mx.mxClient.create(container, {
          assetsPath: 'https://cdnjs.cloudflare.com/ajax/libs/mxgraph/4.2.2/assets/',
          onInit: (graphInstance: any) => {
            if (destroyed) return
            setStatus('ready')

            if (initialData) {
              try {
                const xml = mx.mxUtils.parseXml(initialData)
                const codec = new mx.mxGraphCodec()
                codec.decode(xml.documentElement, graphInstance.getModel())
              } catch {
                // 忽略解析错误
              }
            }

            graphInstance.getModel().addListener(mx.mxEvent.CHANGE, () => {
              const encoder = new mx.mxCodec()
              const xml = encoder.encode(graphInstance.getModel())
              onChange?.(mx.mxUtils.getXml(xml))
            })
          },
        })
      } catch {
        if (!destroyed) {
          setStatus('error')
          setErrorMsg('mxgraph 初始化失败')
        }
      }
    }

    loadMxgraph()

    return () => {
      destroyed = true
    }
  }, [])

  if (status === 'error') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
        <p className="text-lg mb-2">Draw.io 加载失败</p>
        <p className="text-sm">{errorMsg}</p>
        <button
          onClick={() => { setStatus('loading'); setErrorMsg('') }}
          className="mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          重试
        </button>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-2 text-sm text-gray-500">
        Draw.io 编辑器 {status === 'loading' && '(加载中...)'}
      </div>
      <div ref={containerRef} className="flex-1 border border-gray-200 dark:border-gray-700" />
    </div>
  )
}
