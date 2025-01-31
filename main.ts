import express, { Express, Request, Response, Next } from 'express'
import performCounter from '~/server/routes/counter.ts'
import performLogin from '~/server/routes/login.ts'
import {resSrcFiles, resPageAdmin, resFavicon} from './client/routes/index.ts'
import resCounters from '~/server/routes/counters.ts'
import addCounter from '~/server/routes/addCounter.ts'
import editCounter from '~/server/routes/editCounter.ts'
import delCounter from '~/server/routes/delCounter.ts'
import checkTables from '~/server/db/checks.ts'
import authMiddleware from '~/server/routes/authMiddleware.ts'

const PORT = Number(Deno.env.get('APP_PORT'))
if (!PORT) throw new Error('APP_PORT is not defined!')

const app: Express = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((_req: Request, res: Response, next: Next) => {
  res.header('Access-Control-Allow-Origin', '*')
  next()
})
app.get('/favicon.ico', resFavicon)
app.get('/src/*', resSrcFiles)
app.get('/admin', resPageAdmin)
app.get('/:name', performCounter)
app.post('/api/login', performLogin)
app.get('/api/counters', resCounters)
app.post('/api/counter', authMiddleware, addCounter)
app.put('/api/counter/:id', authMiddleware, editCounter)
app.delete('/api/counter/:id', authMiddleware, delCounter)

app.listen(PORT, () => {
  checkTables()

  console.log(`\x1b[33m  → ✨ Server is listening on port: \x1b[96m${PORT}\x1b[0m`)
})
