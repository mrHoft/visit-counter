// @deno-types="npm:@types/express@5"
import { Request, Response } from 'express'
import db from '~/server/utils/pool.ts'
import { type TUsersTableSchema } from '~/server/db/types.ts'
import requestLog from '~/server/utils/log.ts'

const getUsers = (req: Request, res: Response) => {
  const { name } = req.user!
  requestLog('Get users', req, name)

  db.pool.query<TUsersTableSchema>('SELECT * FROM users;').then(({ rows }) => {
    res.status(200).json(rows)
  }).catch((err) => {
    res.status(500).end(err.message)
  })
}

export default getUsers
