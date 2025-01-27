// @deno-types="npm:@types/express@5"
import { Request, Response } from 'express'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { ReactDomServer } from '~/client/utils/deps.ts'
import App from '~/client/src/app.tsx'
import { getCookieByKey } from '~/client/utils/cookie.ts'
import db from '~/server/utils/pool.ts'
import { TUser } from '~/client/src/api/types.ts'

const getAuthState = async (cookie?: string) => {
  if (cookie) {
    const token = getCookieByKey(cookie, 'vc_token')
    if (token) {
      const { rows } = await db.pool.query<TUser>(
        'SELECT * FROM users WHERE token = $1;',
        [token],
      )
      if (rows.length) {
        const user = { ...rows[0] }
        delete user.token
        return user
      }
    }
  }
}

export default async function resPageAdmin(req: Request, res: Response) {
  const { cookie } = req.headers
  const initialUser = await getAuthState(cookie)
  if (initialUser) console.log('Known user:', initialUser)

  const template = readFileSync(path.resolve('client/index.html'), 'utf-8')
  const html = ReactDomServer.renderToString(App({ server: true, initialUser }))
  const stateMarkup = `<script id="state-outlet">globalThis.__INITIAL_USER_STATE__=${
    JSON.stringify(initialUser)
  };</script>`
  const output = template.replace('<!--app-outlet-->', html).replace('<!--state-outlet-->', stateMarkup) //.replace('/* css-outlet */', css)

  res.status(200).set({ 'Content-Type': 'text/html' }).end(output)
}
