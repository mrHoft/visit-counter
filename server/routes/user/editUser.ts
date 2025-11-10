// @deno-types="npm:@types/express@5"
import { Request, Response } from 'express'

import { executeQuery } from '~/server/db/client.ts'
import { type TUserRole, type TUsersTableSchema } from '~/server/db/types.ts'
import requestLog from '~/server/utils/log.ts'
import { createUserToken } from '~/server/utils/token.ts'

type TPayload = { name: string; password?: string; email: string; role: TUserRole }

const editUser = async (req: Request, res: Response) => {
  const { id } = req.params
  const { name, password, email, role } = req.body as TPayload
  const { name: createdBy } = req.user!
  requestLog('Edit user', req, createdBy)

  if (name.length < 3) {
    return res.status(403).end('Wrong user details')
  }

  let set = 'SET name = $1, email = $2, role=$3, created_by = $4'
  const values = [name, email, role, createdBy, id]
  if (password) {
    const token = await createUserToken(name, password)
    set = `${set}, token = $6`
    values.push(token)
  }

  console.log(set)

  executeQuery<TUsersTableSchema>(`UPDATE users ${set} WHERE id = $5 RETURNING *;`, values)
    .then((rows) => {
      res.status(200).json(rows[0])
    }).catch((error) => {
      res.status(500).end(error.message)
    })
}

export default editUser
