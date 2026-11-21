export function useDownload() {
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

  async function download(href: string, name: string) {
    try {
      // Fetch into a blob so the browser saves the file instead of navigating
      // to it (or opening it in a new tab).
      const res = await fetch(href)
      if (!res.ok) throw new Error(`Failed to fetch ${href}`)
      saveBlob(await res.blob(), name)
    } catch {
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
