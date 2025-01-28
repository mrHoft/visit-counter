import { Request } from 'express'

export default function getHeaders(req: Request) {
  const timestamp = new Date().toJSON().slice(0, 19)
  const referer = req.headers['referer']
  const host = req.headers['host']
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress
  const platform = (() => {
    const ua = req.headers['sec-ch-ua-platform']
    if (Array.isArray(ua)) return ua[0]
    return ua
  })()?.replaceAll('"', '')
  const agent = (() => {
    const ua = req.headers['sec-ch-ua']
    if (ua) {
      if (Array.isArray(ua)) return ua[0]
      return ua.split(',')[0]
    }
    return req.headers['user-agent']?.split(' ')[0]
  })()?.replaceAll('"', '')?.split(';')[0]

  return { timestamp, referer, host, platform, agent, ip }
}
