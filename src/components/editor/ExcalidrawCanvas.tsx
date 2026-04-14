import { useState } from 'react'
import { Excalidraw } from '@excalidraw/excalidraw'

interface ExcalidrawCanvasProps {
  initialData?: string
}

export default function ExcalidrawCanvas({ initialData }: ExcalidrawCanvasProps) {
  const [viewMode, setViewMode] = useState(false)

  const initialAppState = initialData ? { ...JSON.parse(initialData) } : undefined

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
          initialData={initialAppState}
          theme="light"
        />
      </div>
    </div>
  )
}
