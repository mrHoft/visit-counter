// @deno-types="npm:@types/express@5"
import { Request, Response } from 'express'

import { executeQuery } from '~/server/db/client.ts'
import { type TUsersTableSchema } from '~/server/db/types.ts'
import requestLog from '~/server/utils/log.ts'

const getUsers = (req: Request, res: Response) => {
  const { name } = req.user!
  requestLog('Get users', req, name)

  executeQuery<TUsersTableSchema>('SELECT * FROM users;').then((rows) => {
    res.status(200).json(rows)
  }).catch((error) => {
    res.status(500).end(error.message)
  })
}

export default getUsers
