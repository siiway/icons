export function useDownload() {
  const { bgColor } = useBackground()

  function saveBlob(blob: Blob, name: string) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  function loadImage(src: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error(`Failed to load ${src}`))
      img.src = src
    })
  }

  // Draw the icon over the selected background color and save as a new PNG.
  async function saveWithBackground(href: string, name: string, color: string) {
    const img = await loadImage(href)
    const canvas = document.createElement('canvas')
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = color
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0)
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
    if (blob) saveBlob(blob, name.replace(/\.(png|svg)$/i, '-bg.png'))
  }

  async function download(href: string, name: string) {
    const color = bgColor.value
    try {
      // Fetch into a blob so the browser saves the file instead of navigating
      // to it (or opening it in a new tab).
      const res = await fetch(href)
      if (!res.ok) throw new Error(`Failed to fetch ${href}`)
      const blob = await res.blob()
      if (!color) {
        saveBlob(blob, name)
        return
      }
      const url = URL.createObjectURL(blob)
      try {
        await saveWithBackground(url, name, color)
      } finally {
        URL.revokeObjectURL(url)
      }
    } catch {
      if (color) {
        try {
          await saveWithBackground(href, name, color)
          return
        } catch {
          // fall through to a plain download below
        }
      }
      const a = document.createElement('a')
      a.href = href
      a.download = name
      document.body.appendChild(a)
      a.click()
      a.remove()
    }
  }

  return { download }
}
