// @deno-types="npm:@types/express@5"
import { Request, Response } from 'express'
import db from '~/server/utils/pool.ts'
import { type TCountersTableSchema } from '~/server/db/types.ts'
import { ERROR_CODES } from '~/server/db/codes.ts'
import requestLog from '~/server/log/request.ts'

const addCounter = (req: Request<unknown, unknown, { name: string; value: string }>, res: Response) => {
  requestLog('Add counter', req)
  const { name, value } = req.body
  const { name: createdBy } = req.user!

  if (name.length < 3 || value.length < 1) {
    return res.status(403).end('Wrong counter details')
  }

  db.pool.query<TCountersTableSchema>(
    'INSERT INTO counters (name, value, created_by) VALUES ($1, $2, $3) RETURNING *;',
    [
      name,
      value,
      createdBy,
    ],
  )
    .then(({ rows }) => {
      res.status(200).json(rows[0])
    }).catch((err) => {
      if (err.code === ERROR_CODES.duplicate) {
        return res.status(403).end(`Counter ${name} already exists.`)
      }
      res.status(500).end(err.message)
    })
}

export default addCounter
