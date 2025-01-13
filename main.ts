// import cors from 'cors';
import express, { Express, Request, Response, Next } from 'express'
import db from '~/server/utils/pool.ts'
import performCounter from '~/server/routes/counter.ts'

const PORT = Number(Deno.env.get('APP_PORT'))
if (!PORT) throw new Error('APP_PORT is not defined!')

const app: Express = express()

// app.use(cors({ origin: ['http://localhost:3000', 'https://app.daytec.ru', 'https://app.nobey.ru'] }));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((_req: Request, res: Response, next: Next) => {
  res.header('Access-Control-Allow-Origin', '*')
  // res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
  // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})
app.get('/:name', performCounter)

app.listen(PORT, () => {
  db.pool.query<Record<'name', string>>('SELECT name FROM counter;')
    .then(({rows}) => {
      console.log('Available counters:', rows.map(({name}) => name).join(', '))
    })
    .catch(error => {
      console.log(`Connection to \x1b[96m${Deno.env.get('PG_DB')}\x1b[0m was failed:`, error.message);
    });

  console.log(`\x1b[33m  → ✨ Server is listening on port: \x1b[96m${PORT}\x1b[0m`)
})
