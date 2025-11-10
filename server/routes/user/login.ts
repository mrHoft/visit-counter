// @deno-types="npm:@types/express@5"
import { Request, Response } from 'express'

import { executeQuery } from '~/server/db/client.ts'
import { type TUsersTableSchema } from '~/server/db/types.ts'
import { validateUser } from '~/server/utils/token.ts'
import requestLog from '~/server/utils/log.ts'

const performLogin = async (req: Request, res: Response) => {
  const { name, password } = req.body
  requestLog('Login', req, name)

  if (name.length < 3 || password.length < 5) {
    return res.status(403).end('Forbidden')
  }

  const rows = await executeQuery<TUsersTableSchema>(
    'SELECT * FROM users WHERE name = $1;',
    [name],
  )
  if (!rows.length) return res.status(404).end(`User ${name} not found.`)

  const { token } = rows[0]
  const valid = await validateUser(token, password)
  if (!valid) return res.status(403).end('Login or password is not match.')

  res.status(200).json(rows[0])
}

export default performLogin
