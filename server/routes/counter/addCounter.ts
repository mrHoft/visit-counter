// @deno-types="npm:@types/express@5"
import { Request, Response } from 'express'

import { executeQuery } from '~/server/db/client.ts'
import { type TCountersTableSchema } from '~/server/db/types.ts'
import { ERROR_CODES } from '~/server/db/codes.ts'
import requestLog from '~/server/utils/log.ts'

const addCounter = (req: Request, res: Response) => {
  const { name, value } = req.body
  const { name: createdBy } = req.user!
  requestLog('Add counter', req, createdBy)

  if (name.length < 3 || value.length < 1) {
    return res.status(403).end('Wrong counter details')
  }

  executeQuery<TCountersTableSchema>(
    'INSERT INTO counters (name, value, created_by) VALUES ($1, $2, $3) RETURNING *;',
    [
      name,
      value,
      createdBy,
    ],
  )
    .then((rows) => {
      res.status(200).json(rows[0])
    }).catch((error) => {
      if (error.fields.code === ERROR_CODES.duplicate) {
        return res.status(403).end(`Counter ${name} already exists.`)
      }
      res.status(500).end(error.message)
    })
}

export default addCounter
