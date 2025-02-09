// @deno-types="npm:@types/express@5"
import { Request, Response } from 'express'
import { type TCounterType } from '~/server/template/counter.ts'
import { type TCounterTableSchema } from '~/server/db/types.ts'
import db from '~/server/utils/pool.ts'
import requestLog from '~/server/log/request.ts'

const getVisits = async (counterName: string) => {
  return (await db.pool.query<{ value: number }>(`SELECT value FROM counters WHERE name = '${counterName}';`)).rows[0]
    .value
}

const getPeriod = async (counterName: string, dateFrom: Date, dateTo: Date) => {
  return (await db.pool.query<{ count: number }>(
    `SELECT count(*) FROM "${counterName}" WHERE created_at >= $1 AND created_at <= $2;`,
    [dateFrom, dateTo],
  )).rows[0].count
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

  let query = `SELECT * FROM "${name}" WHERE created_at >= $1 AND created_at <= $2`
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

  const { rows } = await db.pool.query<TCounterTableSchema & { total: number }>(`${query};`, params).catch((err) => {
    console.log(err.message)
    return { rows: [] }
  })
  if (!rows.length) return res.status(404).end(`No analytics for ${name} was found.`)

  const total = await getVisits(name)
  const lastMonth = await getPeriod(
    name,
    new Date(new Date().setMonth(new Date().getMonth() - 1, 1)),
    new Date(new Date().setMonth(new Date().getMonth(), 0)),
  )
  const currMonth = await getPeriod(
    name,
    new Date(new Date().setMonth(new Date().getMonth(), 1)),
    new Date(new Date().setMonth(new Date().getMonth())),
  )

  res.status(200).json({ data: rows, period: rows.length, lastMonth, currMonth, total })
}

export default getAnalytics
