// @deno-types="npm:@types/express@5"
import { Request, Response } from 'express'
import { type TCounterType } from '~/server/template/counter.ts'
import { type TCounterTableSchema } from '~/server/db/types.ts'
import db from '~/server/utils/pool.ts'
import requestLog from '~/server/log/request.ts'

const getStats = async (counterName: string) => {
  const { value } =
    (await db.pool.query<{ value: number }>(`SELECT value FROM counters WHERE name = '${counterName}';`)).rows[0]
  return value
}

type TAnalyticsQuery = {
  from?: string
  to?: string
  title?: string
  color?: string
  type?: TCounterType
}

const getAnalytics = async (req: Request<{ name: string }, unknown, unknown, TAnalyticsQuery>, res: Response) => {
  requestLog('Get analytics', req)
  const { name } = req.params

  const { from, to, title, color, type } = req.query
  const dateFrom = from ? new Date(from) : new Date(new Date().setMonth(new Date().getMonth() - 1, 1))
  const dateTo = to ? new Date(to) : new Date()

  let query = `SELECT * FROM "${name}" WHERE timestamp >= $1 AND timestamp <= $2`
  const params: (Date | string)[] = [dateFrom, dateTo]
  if (title) {
    params.push(title)
    query = `${query} AND title = $${params.length}`
  }
  if (color) {
    params.push(color)
    query = `${query} AND color = $${params.length}`
  }
  if (type) {
    params.push(type)
    query = `${query} AND type = $${params.length}`
  }

  const { rows } = await db.pool.query<TCounterTableSchema & { total: number }>(`${query};`, params)
  if (!rows.length) return res.status(403).end(`No analytics for ${name} was found.`)

  const visits = await getStats(name)

  res.status(200).json({ data: rows, total: rows.length, visits })
}

export default getAnalytics
