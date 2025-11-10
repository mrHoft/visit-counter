// @deno-types="npm:@types/express@5"
import { Request, Response } from 'express'

import { executeQuery } from '~/server/db/client.ts'
import { ERROR_CODES } from '~/server/db/codes.ts'
import { type TCounterType } from '~/server/template/counter.ts'
import { type TStatName } from '~/client/src/api/types.ts'
import requestLog from '~/server/utils/log.ts'

const getVisits = async (counterName: string) => {
  return (await executeQuery<{ value: number }>(`SELECT value FROM counters WHERE name = '${counterName}';`))[0]
    .value
}

const getPeriod = async (counterName: string, dateFrom: Date, dateTo: Date) => {
  const { count, error }: { count?: number; error?: string } = await executeQuery<{ count: number }>(
    `SELECT count(*)::int FROM "${counterName}" WHERE created_at >= $1 AND created_at <= $2;`,
    [dateFrom, dateTo],
  )
    .then((rows) => ({ count: rows[0].count }))
    .catch((err) => {
      if (err.fields.code === ERROR_CODES.relation) {
        return { error: `No analytics for ${counterName} was found.` }
      }

      return { error: err.message as string }
    })
  return { count, error }
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

  const currMonth = await getPeriod(
    name,
    new Date(new Date().setMonth(new Date().getMonth(), 1)),
    new Date(new Date().setMonth(new Date().getMonth())),
  )
  console.log(currMonth)
  if (currMonth.error) return res.status(500).end(currMonth.error)
  if (!currMonth.count) return res.status(404).end(`No analytics for ${name} was found.`)

  const lastMonth = await getPeriod(
    name,
    new Date(new Date().setMonth(new Date().getMonth() - 1, 1)),
    new Date(new Date().setMonth(new Date().getMonth(), 0)),
  )
  const total = await getVisits(name)

  const whereConditions: string[] = ['created_at BETWEEN $1 AND $2']
  const params: (Date | string)[] = [dateFrom, dateTo]
  let paramCount = 2

  if (title) {
    paramCount++
    whereConditions.push(`title = $${paramCount}`)
    params.push(title)
  }
  if (color) {
    paramCount++
    whereConditions.push(`color = $${paramCount}`)
    params.push(color)
  }
  if (type) {
    paramCount++
    whereConditions.push(`type = $${paramCount}`)
    params.push(type)
  }

  const whereClause = whereConditions.join(' AND ')

  const graphQuery = /* sql */ `
    SELECT to_char(created_at, 'MM-DD') as date, COUNT(*)::int as count
    FROM "${name}"
    WHERE ${whereClause}
    GROUP BY to_char(created_at, 'MM-DD')
    ORDER BY date
  `

  const statsQuery = /* sql */ `
    SELECT
      jsonb_object_agg(coalesce(country, 'unknown'), count) as country,
      jsonb_object_agg(coalesce(platform, 'unknown'), count) as platform,
      jsonb_object_agg(coalesce(agent, 'unknown'), count) as agent,
      jsonb_object_agg(
        CASE
          WHEN is_mobile = true THEN 'mobile'
          WHEN is_mobile = false THEN 'desktop'
          ELSE 'unknown'
        END,
        count
      ) as mobile,
      jsonb_object_agg(coalesce(title, 'unknown'), count) as title,
      jsonb_object_agg(coalesce(color, 'unknown'), count) as color,
      jsonb_object_agg(coalesce(type::text, 'unknown'), count) as type
    FROM (
      SELECT country, platform, agent, is_mobile, title, color, type, COUNT(*)::int as count
      FROM "${name}"
      WHERE ${whereClause}
      GROUP BY country, platform, agent, is_mobile, title, color, type
    ) aggregated
  `

  const [graphResult, statsResult] = await Promise.all([
    executeQuery<{ date: string; count: number }>(graphQuery, params),
    executeQuery<Record<TStatName, Record<string, number>>>(statsQuery, params),
  ])

  const graphData = graphResult.reduce<Record<string, number>>((acc, row) => {
    acc[row.date] = row.count
    return acc
  }, {})

  res.status(200).json({
    stats: statsResult[0],
    graph: graphData,
    period: Object.values(graphData).reduce((sum, count) => sum + count, 0),
    lastMonth: lastMonth.count,
    currMonth: currMonth.count,
    total,
  })
}

export default getAnalytics
