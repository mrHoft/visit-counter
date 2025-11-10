// @deno-types="npm:@types/express@5"
import { Request, Response } from 'express'

import { executeQuery } from '~/server/db/client.ts'
import { type TUsersTableSchema } from '~/server/db/types.ts'
import requestLog from '~/server/utils/log.ts'

const delUser = (req: Request, res: Response) => {
  const { id } = req.params
  const { name } = req.user!
  requestLog('Delete user', req, name)

  executeQuery<TUsersTableSchema>(
    'DELETE FROM users WHERE id = $1 RETURNING *;',
    [id],
  )
    .then((rows) => {
      res.status(200).json(rows[0])
    }).catch((error) => {
      console.log(error)
      res.status(500).end(error.message)
    })
}

export default delUser
