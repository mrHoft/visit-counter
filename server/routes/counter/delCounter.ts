// @deno-types="npm:@types/express@5"
import { Request, Response } from 'express'
import db from '~/server/utils/pool.ts'
import { type TCountersTableSchema } from '~/server/db/types.ts'
import requestLog from '~/server/utils/log.ts'

const delCounter = (req: Request<{ id: number }>, res: Response) => {
  const { id } = req.params
  const { name } = req.user!
  requestLog('Delete counter', req, name)

  db.pool.query<TCountersTableSchema>(
    'DELETE FROM counters WHERE id = $1 RETURNING *;',
    [id],
  )
    .then(({ rows }) => {
      res.status(200).json(rows[0])
    }).catch((err) => {
      console.log(err)
      res.status(500).end(err.message)
    })
}

export default delCounter
