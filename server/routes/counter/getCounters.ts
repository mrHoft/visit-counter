// @deno-types="npm:@types/express@5"
import { Request, Response } from 'express'

import { executeQuery } from '~/server/db/client.ts'
import { type TCountersTableSchema } from '~/server/db/types.ts'
import requestLog from '~/server/utils/log.ts'

const getCounters = (req: Request, res: Response) => {
  const { name } = req.user!
  requestLog('Get counters', req, name)

  executeQuery<TCountersTableSchema>('SELECT * FROM counters;').then((rows) => {
    res.status(200).json(rows)
  }).catch((error) => {
    res.status(500).end(error.message)
  })
}

export default getCounters
