export default function mime(extension: string) {
  if (!extension) return 'text/plain'

  const ext = extension.toLowerCase().replace('.', '')
  if (ext === 'svg') return 'image/svg+xml'
  if (ext === 'js') return 'application/javascript'
  return `text/${ext}`
}
