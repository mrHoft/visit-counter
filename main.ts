import express, { Express, Request, Response, NextFunction } from 'express'

import {checkDatabase} from '~/server/db/checks.ts'
import {authMiddleware,spamMiddleware} from './server/routes/middleware/index.ts'
import {resSrcFiles, resPublicFiles, resPageAdmin, resFavicon} from '~/server/routes/client/index.ts'
import {addCounter, performCounter, delCounter, editCounter, getAnalytics, getCounters} from '~/server/routes/counter/index.ts'
import {addUser, delUser, editUser, getUsers, performLogin } from '~/server/routes/user/index.ts'

const PORT = Number(Deno.env.get('APP_PORT'))
if (!PORT) throw new Error('APP_PORT is not defined!')

await checkDatabase()


const app: Express = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`Incoming request: ${req.method} ${req.url}`)
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true')

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next()
})
app.set('trust proxy', true);
// Page
app.get('/', resPageAdmin)
app.get('/favicon.ico', resFavicon)
app.get('/src/*', resSrcFiles)
app.get('/public/*', resPublicFiles)
app.post('/api/login', performLogin)
// Counter
app.get('/:name', spamMiddleware, performCounter)
app.get('/api/analytics/:name', authMiddleware(), getAnalytics)
// Counters
app.get('/api/counters', authMiddleware(), getCounters)
app.post('/api/counter', authMiddleware(), addCounter)
app.put('/api/counter/:id', authMiddleware(), editCounter)
app.delete('/api/counter/:id', authMiddleware(), delCounter)
// Users
app.get('/api/users', authMiddleware(['admin']), getUsers)
app.post('/api/user', authMiddleware(['admin']), addUser)
app.put('/api/user/:id', authMiddleware(['admin']), editUser)
app.delete('/api/user/:id', authMiddleware(['admin']), delUser)

app.listen(PORT, () => {
  console.log(`\x1b[33m  → ✨ Server is listening on port: \x1b[96m${PORT}\x1b[0m`)
})
