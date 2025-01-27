import { NextFunction, Request, Response } from 'express'
import db from '~/server/utils/pool.ts'
import { type TUsersTableSchema } from '~/server/db/types.ts'
import { getCookieByKey } from '~/client/utils/cookie.ts'

const getAuthState = async (cookie?: string) => {
  if (cookie) {
    const token = getCookieByKey(cookie, 'vc_token')
    if (token) {
      const { rows } = await db.pool.query<TUsersTableSchema>(
        'SELECT * FROM users WHERE token = $1;',
        [token],
      )
      if (rows.length) {
        return rows[0]
      }
    }
  }
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const { cookie } = req.headers
  const user = await getAuthState(cookie)
  if (!user) {
    res.status(401).end('Unauthorized')
    return
  }
  req.user = user
  return next()
}

export default authMiddleware
