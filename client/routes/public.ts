// @deno-types="npm:@types/express@5"
import { Request, Response } from 'express'
import path from 'node:path'
import mime from '~/client/utils/mime.ts'

export default function resPublicFiles(req: Request, res: Response) {
  const filepath = req.path
  const ext = path.extname(filepath).toLowerCase().replace('.', '')
  const fullpath = path.resolve('client', ...filepath.split('/'))

  Deno.readFile(fullpath).then((data) => {
    res.status(200).set({ 'Content-Type': mime(ext) }).end(data)
  }).catch((err) => {
    console.error('Error reading file:', fullpath /* err.message */)
    return res.status(404).end()
  })
}
