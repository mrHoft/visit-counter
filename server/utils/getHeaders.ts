import { Request } from 'express'
import getUserAgent from '~/server/utils/userAgent.ts'

export default function getHeaders(req: Request) {
  const timestamp = new Date().toJSON().slice(0, 19)
  const ip = ((req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress) as string) || null
  const { browser, version, os: platform, isMobile } = getUserAgent(req.headers['user-agent'] as string)
  const agent = (() => {
    const ua = req.headers['sec-ch-ua'] as string
    return ua && ua.split(',').pop()?.trim().replaceAll('"', '')?.replace(';v=', ' ') || null
  })()

  return { timestamp, platform, browser: `${browser} ${version}`, isMobile, agent, ip }
}
