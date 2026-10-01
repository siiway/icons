export function useDownload() {
  const { bgColor } = useBackground()

  function download(href: string, name: string) {
    if (!bgColor.value) {
      const a = document.createElement('a')
      a.href = href
      a.download = name
      document.body.appendChild(a)
      a.click()
      a.remove()
      return
    }
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = href
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.fillStyle = bgColor.value as string
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
      const a = document.createElement('a')
      a.href = canvas.toDataURL('image/png')
      a.download = name.replace(/\.(png|svg)$/i, '-bg.png')
      a.click()
      a.remove()
    }
  }

  return { download }
}
