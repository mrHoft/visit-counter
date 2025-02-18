// @deno-types="npm:@types/express@5"
import { Request, Response } from 'express'
import db from '~/server/utils/pool.ts'
import { type TUsersTableSchema } from '~/server/db/types.ts'
import requestLog from '~/server/utils/log.ts'

const delUser = (req: Request<{ id: number }>, res: Response) => {
  const { id } = req.params
  const { name } = req.user!
  requestLog('Delete user', req, name)

  db.pool.query<TUsersTableSchema>(
    'DELETE FROM users WHERE id = $1 RETURNING *;',
    [id],
  )
    .then(({ rows }) => {
      res.status(200).json(rows[0])
    }).catch((err) => {
      console.log(err)
      res.status(500).end(err.message)
    })
}

export default delUser
