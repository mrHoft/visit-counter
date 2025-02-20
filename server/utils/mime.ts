export default function mime(ext: string) {
  if (!ext) return 'text/plain'
  if (ext === 'svg') return 'image/svg+xml'
  if (ext === 'png') return 'image/png'
  if (ext === 'js') return 'application/javascript'
  if (ext === 'json') return 'application/json'
  return `text/${ext}`
}
