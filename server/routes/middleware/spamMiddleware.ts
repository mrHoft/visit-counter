import { NextFunction, Request, Response } from 'express'
import { isIP } from 'node:net'
import { ipToNumber } from '~/server/utils/ip.ts'

type TRequestRecords = {
  [key: number]: {
    timestamp: number
    name: string[]
  }
}

const requestRecords: TRequestRecords = {}
const delay = 60 * 60 * 1000

const spamMiddleware = (req: Request<{ name: string }>, _res: Response, next: NextFunction) => {
  const agent = req.headers['user-agent']
  if (agent && (agent as string).includes('github')) return next()

  const ip = req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress
  const { name } = req.params

  if (isIP(ip)) {
    const ipNum = ipToNumber(ip)
    const now = Date.now()
    const record = requestRecords[ipNum]
    if (record) {
      if (now - record.timestamp < delay) {
        if (record.name.includes(name)) {
          req.spam = true
        } else {
          record.name.push(name)
        }
      } else {
        delete requestRecords[ipNum]
      }
    } else {
      requestRecords[ipNum] = {
        timestamp: now,
        name: [name],
      }
    }
  }

  return next()
}

export default spamMiddleware
