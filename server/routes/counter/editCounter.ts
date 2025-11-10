// @deno-types="npm:@types/express@5"
import { Request, Response } from 'express'

import { executeQuery } from '~/server/db/client.ts'
import { type TCountersTableSchema } from '~/server/db/types.ts'
import requestLog from '~/server/utils/log.ts'

const editCounter = (req: Request, res: Response) => {
  const { id } = req.params
  const { name, value } = req.body
  const { name: createdBy } = req.user!
  requestLog('Edit counter', req, createdBy)

  if (name.length < 3 || value.length < 1) {
    return res.status(403).end('Wrong counter details')
  }

  executeQuery<TCountersTableSchema>(
    'UPDATE counters SET name = $1, value = $2, created_by = $3 WHERE id = $4 RETURNING *;',
    [
      name,
      value,
      createdBy,
      id,
    ],
  )
    .then((rows) => {
      res.status(200).json(rows[0])
    }).catch((err) => {
      res.status(500).end(err.message)
    })
}

export default editCounter
