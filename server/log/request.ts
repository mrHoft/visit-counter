import { Request } from 'express'
import getHeaders from '~/server/utils/getHeaders.ts'

export default function requestLog(text: string, req: Request) {
  const { timestamp, agent } = getHeaders(req)
  console.log(`${timestamp} \x1b[96m${text}\x1b[0m request from ${agent}`)
}
