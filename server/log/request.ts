import { Request } from 'express'

export default function requestLog(text: string, req: Request, name?: string) {
  const timestamp = new Date().toJSON().slice(0, 19)
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress
  console.log(`${timestamp} \x1b[96m${text}\x1b[0m request${name ? ` from \x1b[33m${name}\x1b[0m` : ''} (${ip})`)
}
