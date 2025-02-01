import express, { Express, Request, Response, Next } from 'express'
import performCounter from '~/server/routes/counter.ts'
import performLogin from '~/server/routes/login.ts'
import {resSrcFiles, resPageAdmin, resFavicon} from './client/routes/index.ts'
import getCounters from './server/routes/getCounters.ts'
import getUsers from './server/routes/getUsers.ts'
import addUser from '~/server/routes/addUser.ts'
import delUser from '~/server/routes/delUser.ts'
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
// Page
app.get('/', resPageAdmin)
app.get('/favicon.ico', resFavicon)
app.get('/src/*', resSrcFiles)
app.get('/:name', performCounter)
app.post('/api/login', performLogin)
// Counters
app.get('/api/counters', getCounters)
app.post('/api/counter', authMiddleware(), addCounter)
app.put('/api/counter/:id', authMiddleware(), editCounter)
app.delete('/api/counter/:id', authMiddleware(), delCounter)
// Users
app.get('/api/users', authMiddleware(['admin']), getUsers)
app.post('/api/user', authMiddleware(['admin']), addUser)
app.delete('/api/user/:id', authMiddleware(['admin']), delUser)

app.listen(PORT, () => {
  checkTables()

  console.log(`\x1b[33m  → ✨ Server is listening on port: \x1b[96m${PORT}\x1b[0m`)
})
