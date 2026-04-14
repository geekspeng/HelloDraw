import { useEffect, useRef, useState } from 'react'
import { Excalidraw } from '@excalidraw/excalidraw'

interface ExcalidrawCanvasProps {
  initialData?: string
  onChange?: (data: any) => void
}

export default function ExcalidrawCanvas({ initialData, onChange }: ExcalidrawCanvasProps) {
  const [viewMode, setViewMode] = useState(false)
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null)

  useEffect(() => {
    // Initialize with data if provided
    if (initialData && excalidrawAPI) {
      try {
        const parsed = JSON.parse(initialData)
        excalidrawAPI.resetScene(parsed)
      } catch (e) {
        // ignore parse errors
      }
    }
  }, [initialData, excalidrawAPI])

  const handleChange = (elements: any[]) => {
    if (onChange && excalidrawAPI) {
      const scene = excalidrawAPI.getScene()
      onChange(scene)
    }
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-2 flex gap-2">
        <button
          onClick={() => setViewMode(false)}
          className={`px-3 py-1 text-sm rounded ${!viewMode ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          编辑
        </button>
        <button
          onClick={() => setViewMode(true)}
          className={`px-3 py-1 text-sm rounded ${viewMode ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          只读
        </button>
      </div>
      <div className="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <Excalidraw
          viewModeEnabled={viewMode}
          onChange={handleChange}
          onInit={(api: any) => setExcalidrawAPI(api)}
          theme="light"
        />
      </div>
    </div>
  )
}
