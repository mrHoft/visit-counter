// @deno-types="npm:@types/express@5"
import { Request, Response } from 'express'
import db from '~/server/utils/pool.ts'
import { type TUserRole, type TUsersTableSchema } from '~/server/db/types.ts'
import { ERROR_CODES } from '~/server/db/codes.ts'
import requestLog from '~/server/log/request.ts'
import { createUserToken } from '~/server/utils/users.ts'

type TPayload = { name: string; password: string; email: string; role: TUserRole }

const addUser = async (req: Request<{ id: number }, unknown, TPayload>, res: Response) => {
  requestLog('Add user', req)
  const { name, password, email, role } = req.body
  const { name: createdBy } = req.user!

  if (name.length < 3) {
    return res.status(403).end('Wrong user details')
  }

  const token = await createUserToken(name, password)

  db.pool.query<TUsersTableSchema>(
    'INSERT INTO users (name,email,role,token, created_by) VALUES ($1, $2, $3,$4, $5) RETURNING *;',
    [name, email, role, token, createdBy],
  )
    .then(({ rows }) => {
      res.status(200).json(rows[0])
    }).catch((err) => {
      if (err.code === ERROR_CODES.duplicate) {
        return res.status(403).end(`User ${name} already exists.`)
      }
      res.status(500).end(err.message)
    })
}

export default addUser
