// @deno-types="npm:@types/express@5"
import { Request, Response } from 'express'
import { readFileSync } from 'node:fs'
import path from 'node:path'

const favicon = (req: Request, res: Response) => {
  const favicon = readFileSync(path.resolve('client/public/favicon.svg'), 'utf-8')

  res.status(200).set({ 'Content-Type': 'image/svg+xml' }).end(favicon)
}

export default favicon
