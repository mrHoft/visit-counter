// @deno-types="npm:@types/express@5"
import { Response } from 'express'
import getCounter from '~/server/template/counter.ts'
import db from '~/server/utils/pool.ts'
import requestLog from '~/server/utils/log.ts'
import addAnalytics from './addAnalytics.ts'
import type { TCounterRequest } from '~/server/routes/counter/types.ts'

const performCounter = async (req: TCounterRequest, res: Response) => {
  const { name } = req.params
  const { type, title, color } = req.query
  requestLog(`Get "${name}" counter`, req)

  if (name.startsWith('favicon')) {
    return res.status(403).end('Forbidden')
  }

  let value = 0
  if (req.spam) {
    const { rows } = await db.pool.query<Record<'value', number>>(
      'SELECT value FROM counters WHERE name = $1;',
      [name],
    )
    if (!rows.length) return res.status(404).end(`Counter ${name} not found.`)
    value = rows[0].value
  } else {
    const { rows } = await db.pool.query<Record<'value', number>>(
      'UPDATE counters SET value = value + 1 WHERE name = $1 RETURNING value;',
      [name],
    )
    if (!rows.length) return res.status(404).end(`Counter ${name} not found.`)
    value = rows[0].value

    addAnalytics(req)
  }

  const counter = getCounter(value, type, title, color)
  res.set({
    'Content-Type': type === 'number' ? 'text/plain' : 'image/svg+xml',
    'Content-Length': counter.length,
    'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate',
  })
  res.status(200).send(counter)
}

export default performCounter
