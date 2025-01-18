// @deno-types="npm:@types/express@5"
import { Request, Response } from 'express'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { ReactDomServer } from '~/client/utils/deps.ts'
import App from '~/client/src/app.tsx'

export default function resPageAdmin (req: Request, res: Response) {
  const template = readFileSync(path.resolve('client/index.html'), 'utf-8')
  const html = ReactDomServer.renderToString(App({server:true}))
  const output = template.replace('<!--app-outlet-->', html) //.replace('/* css-outlet */', css)

  res.status(200).set({ 'Content-Type': 'text/html' }).end(output)
}
