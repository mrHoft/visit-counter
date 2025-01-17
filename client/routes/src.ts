// @deno-types="npm:@types/express@5"
import { Request, Response } from 'express'
import { readFile } from 'node:fs'
import path from 'node:path'
import mime from '~/client/utils/mime.ts'

const src = (req: Request, res: Response) => {
  const filepath = req.path
  const ext = path.extname(filepath)
  const fullpath = path.resolve('client', ...filepath.split('/'))

  readFile(fullpath, { encoding: 'utf-8' }, (err, data) => {
    if (err) {
      console.error('Error reading file:', err.path)
      return res.status(404).end()
    }
    res.status(200).set({ 'Content-Type': mime(ext) }).end(data)
  })
}

export default src
