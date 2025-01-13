import { IncomingHttpHeaders } from 'node:http'

export default function getHeaders(headers: IncomingHttpHeaders) {
  const timestamp = new Date().toJSON().slice(0, 19)
  const referer = headers['referer']
  const host = headers['host']
  const platform = (() => {
    const ua = headers['sec-ch-ua-platform']
    if (Array.isArray(ua)) return ua[0]
    return ua
  })()?.replaceAll('"', '')
  const agent = (() => {
    const ua = headers['sec-ch-ua']
    if (ua) {
      if (Array.isArray(ua)) return ua[0]
      return ua.split(',')[0]
    }
    return headers['user-agent']?.split(' ')[0]
  })()?.replaceAll('"', '')

  return { timestamp, referer, host, platform, agent }
}
