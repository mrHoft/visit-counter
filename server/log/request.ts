import { IncomingHttpHeaders } from 'node:http'
import getHeaders from '~/server/utils/getHeaders.ts'

export default function requestLog(text: string, headers: IncomingHttpHeaders) {
  const { timestamp, agent } = getHeaders(headers)
  console.log(`${timestamp} \x1b[96m${text}\x1b[0m request from ${agent}`)
}
