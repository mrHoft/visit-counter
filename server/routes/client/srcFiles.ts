// @deno-types="npm:@types/express@5"
import { Request, Response } from 'express'
import path from 'node:path'
import mime from '~/server/utils/mime.ts'
import { bundle } from 'deno-emit'

export default function resSrcFiles(req: Request, res: Response) {
  const filepath = req.path
  const ext = path.extname(filepath).toLowerCase().replace('.', '')
  const fullpath = path.resolve('client', ...filepath.split('/'))

  if (ext === 'tsx') {
    bundle(fullpath).then((result) => {
      return res.status(200).set({ 'Content-Type': 'application/javascript' }).end(result.code)
    })
    return
  }

  Deno.readFile(fullpath).then((data) => {
    res.status(200).set({ 'Content-Type': mime(ext) }).end(data)
  }).catch(() => {
    console.error('Error reading file:', fullpath /* err.message */)
    return res.status(404).end()
  })
}
