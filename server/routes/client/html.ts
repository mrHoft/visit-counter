import { Request, Response } from 'express'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { ReactDomServer } from '~/client/utils/deps.ts'
import App from '~/client/src/app.tsx'
import { getCookieByKey } from '~/client/utils/cookie.ts'
import { executeQuery } from '~/server/db/client.ts'
import { type TUser } from '~/client/src/api/types.ts'
import getVersion from '~/client/utils/version.ts'
import requestLog from '~/server/utils/log.ts'

const APP_HOST = Deno.env.get('APP_HOST') ?? 'http://127.0.0.1:3000'

const getAuthState = async (cookie?: string) => {
  if (cookie) {
    const token = getCookieByKey(cookie, 'vc_token')
    if (token) {
      const rows = await executeQuery<TUser>(
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

const getStats = async () => {
  const { users } = (await executeQuery<{ users: number }>('SELECT count(*)::int AS "users" FROM users;'))[0]
  const { counters } =
    (await executeQuery<{ counters: number }>('SELECT count(*)::int AS "counters" FROM counters;'))[0]
  const { requests } =
    (await executeQuery<{ requests: number }>('SELECT sum(value)::int AS "requests" FROM counters;'))[0]
  return { users, counters, requests }
}

export default async function resPageAdmin(req: Request, res: Response) {
  const { cookie } = req.headers
  const ip = req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress
  const stats = { ...await getStats(), host: APP_HOST, ip, version: getVersion() }
  console.log(stats)
  const user = await getAuthState(cookie)
  requestLog('Admin page', req, user?.name)

  const template = readFileSync(path.resolve('client/index.html'), 'utf-8')
  const html = ReactDomServer.renderToString(App({ server: true, initialUser: user }))
  const stateMarkup = /* html */ `
  <script id="state-outlet">
    globalThis.__INITIAL_USER__=${JSON.stringify(user)};
    globalThis.__INITIAL_STATS__=${JSON.stringify(stats)};
  </script>`
  const output = template.replace('<!--app-outlet-->', html).replace('<!--state-outlet-->', stateMarkup) //.replace('/* css-outlet */', css)

  res.status(200).set({ 'Content-Type': 'text/html' }).end(output)
}
