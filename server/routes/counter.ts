// @deno-types="npm:@types/express@5"
import { Request, Response } from 'express'
import getCounter, { type TCounterType } from '~/server/template/counter.ts'
import getHeaders from '~/server/utils/getHeaders.ts'
import db from '~/server/utils/pool.ts'
import requestLog from '~/server/log/request.ts'
import { ERROR_CODES } from '~/server/db/codes.ts'
import { initTableCounter } from '~/server/db/init.ts'

type TAnalyticsPayload = { req: Request; name: string; title?: string; color?: string; type?: string }
type TAnalyticsResponse = Promise<{ meassge?: string; error?: string }>
const defaultCounter = 'badge'

const addAnalytics = ({ req, name, title, color, type }: TAnalyticsPayload): TAnalyticsResponse => {
  const { ip, platform, agent, browser, isMobile } = getHeaders(req)

  console.log({ ip, platform, agent, browser, isMobile })
  console.log('sec-ch-ua:', req.headers['sec-ch-ua'])
  console.log('sec-ch-ua-platform:', req.headers['sec-ch-ua-platform'])
  console.log('user-agent:', req.headers['user-agent'])

  const addAnalyticsRecord = () =>
    db.pool.query(
      `INSERT INTO "${name}" (ip, platform, agent, title, color, type) VALUES ($1, $2, $3, $4, $5, $6);`,
      [ip, platform, agent, title, color, type ?? defaultCounter],
    )

  return addAnalyticsRecord().then(() => ({ meassge: 'Success!' })).catch((error) => {
    if (error.code === ERROR_CODES.relation) {
      console.log(`No \x1b[33m${name}\x1b[0m table found: creating one...`)
      return db.pool.query(initTableCounter(name)).then(() =>
        addAnalyticsRecord().then(() => ({ meassge: 'Success!' })).catch((err) => {
          console.log(`Adding analytics to \x1b[33m${name}\x1b[0m table: Failed:`, err.message)
          return { error: err.message }
        })
      ).catch((err) => {
        console.log(`Create \x1b[33m${name}\x1b[0m table: Failed:`, err.message)
        return { error: err.message }
      })
    } else {
      console.log(`Adding analytics to \x1b[33m${name}\x1b[0m table: Failed:\n`, error)
      return { error: error.message }
    }
  })
}

const performCounter = async (
  req: Request<{ name: string }, unknown, unknown, { type?: TCounterType; title?: string; color?: string }>,
  res: Response,
) => {
  requestLog('Get counter', req)
  const { name } = req.params

  if (name.startsWith('favicon')) {
    return res.status(403).end('Forbidden')
  }

  const { type, title, color } = req.query
  const { rows } = await db.pool.query<Record<'value', number>>(
    'UPDATE counters SET value = value + 1 WHERE name = $1 RETURNING value;',
    [name],
  )
  if (!rows.length) return res.status(404).end(`Counter ${name} not found.`)

  addAnalytics({ req, name, title, color, type })

  const counter = getCounter(rows[0].value, type, title, color)
  res.set({
    'Content-Type': type === 'number' ? 'text/plain' : 'image/svg+xml',
    'Content-Length': counter.length,
    'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate',
  })
  res.status(200).send(counter)
}

export default performCounter
