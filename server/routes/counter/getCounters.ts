// @deno-types="npm:@types/express@5"
import { Request, Response } from 'express'
import db from '~/server/utils/pool.ts'
import { type TCountersTableSchema } from '~/server/db/types.ts'
import requestLog from '~/server/utils/log.ts'

const getCounters = (req: Request, res: Response) => {
  const { name } = req.user!
  requestLog('Get counters', req, name)

  db.pool.query<TCountersTableSchema>('SELECT * FROM counters;').then(({ rows }) => {
    res.status(200).json(rows)
  }).catch((err) => {
    res.status(500).end(err.message)
  })
}

export default getCounters
