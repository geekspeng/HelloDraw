import mermaid from 'mermaid'

export async function exportMermaidAsSvg(code: string): Promise<string> {
  mermaid.initialize({ startOnLoad: false, outputSvg: true })
  const { svg } = await mermaid.render('export-svg', code)
  return svg
}

export async function exportMermaidAsPng(code: string): Promise<void> {
  const svg = await exportMermaidAsSvg(code)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas context not available')

  const img = new Image()
  img.onload = () => {
    canvas.width = img.width * 2
    canvas.height = img.height * 2
    ctx.scale(2, 2)
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0)
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'chart.png'
        a.click()
        URL.revokeObjectURL(url)
      }
    })
  }
  img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)))
}

export function downloadSvg(svgContent: string, filename: string = 'chart.svg') {
  const blob = new Blob([svgContent], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
