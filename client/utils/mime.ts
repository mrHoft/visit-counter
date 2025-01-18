export default function mime(ext: string) {
  if (!ext) return 'text/plain'
  if (ext === 'svg') return 'image/svg+xml'
  if (ext === 'js') return 'application/javascript'
  return `text/${ext}`
}
