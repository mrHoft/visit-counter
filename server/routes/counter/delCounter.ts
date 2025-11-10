// @deno-types="npm:@types/express@5"
import { Request, Response } from 'express'

import { executeQuery } from '~/server/db/client.ts'
import { type TCountersTableSchema } from '~/server/db/types.ts'
import requestLog from '~/server/utils/log.ts'

const delCounter = (req: Request, res: Response) => {
  const { id } = req.params
  const { name } = req.user!
  requestLog('Delete counter', req, name)

  executeQuery<TCountersTableSchema>(
    'DELETE FROM counters WHERE id = $1 RETURNING *;',
    [id],
  )
    .then((rows) => {
      res.status(200).json(rows[0])
    }).catch((err) => {
      console.log(err)
      res.status(500).end(err.message)
    })
}

export default delCounter
