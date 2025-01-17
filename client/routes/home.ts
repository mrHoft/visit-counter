// @deno-types="npm:@types/express@5"
import { Request, Response } from 'express'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import App from '~/client/src/app.tsx'

const pageAdmin = (req: Request, res: Response) => {
  const template = readFileSync(path.resolve('client/index.html'), 'utf-8')
  const html = renderToStaticMarkup(App())
  const output = template.replace('<!--app-outlet-->', html) //.replace('/* css-outlet */', css)

  res.status(200).set({ 'Content-Type': 'text/html' }).end(output)
}

export default pageAdmin
