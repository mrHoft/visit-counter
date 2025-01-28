// @deno-types="npm:@types/express@5"
import { Request, Response } from 'express'
import getCounter, { type TCounterType } from '~/server/template/counter.ts'
// import getHeaders from '~/server/utils/getHeaders.ts'
import db from '~/server/utils/pool.ts'
import requestLog from '~/server/log/request.ts'

const performCounter = async (
  req: Request<{ name: string }, unknown, unknown, { type?: TCounterType; title?: string; color?: string }>,
  res: Response,
) => {
  requestLog('Get counter', req.headers)
  const { name } = req.params

  if (name.startsWith('favicon')) {
    return res.status(403).end('Forbidden')
  }

  const { type, title, color } = req.query
  // TODO: analitics database recording
  // const headers = { name, title, color, ...getHeaders(req.headers) }; console.log(headers)
  const { rows } = await db.pool.query<Record<'value', number>>(
    'UPDATE counters SET value = value + 1 WHERE name = $1 RETURNING value;',
    [name],
  )
  if (!rows.length) return res.status(404).end(`Counter ${name} not found.`)

  const counter = getCounter(rows[0].value, type, title, color)
  res.set({
    'Content-Type': type === 'number' ? 'text/plain' : 'image/svg+xml',
    'Content-Length': counter.length,
    'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate',
  })
  res.status(200).send(counter)
}

export default performCounter
