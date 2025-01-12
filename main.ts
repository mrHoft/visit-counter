// import cors from 'cors';
import express, { type Express, type Request, type Response, type Next } from 'express'
// import pool from './config/db';
import getCounter from './template/counter.ts'
import getHeaders from './utils/getHeaders.ts'

const PORT = Number(Deno.env.get('APP_PORT'))
if (!PORT) throw new Error('APP_PORT is not defined!')

const app: Express = express()

// app.use(cors({ origin: ['http://localhost:3000', 'https://app.daytec.ru', 'https://app.nobey.ru'] }));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((_req: Request, res: Response, next: Next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})
app.use('/', (req: Request, res: Response) => {
  console.log(getHeaders(req.headers))
  res.status(200).send(getCounter(1000))
})

app.listen(PORT, () => {
  /* 
  pool
    .connect()
    .then(client => {
      console.log(
        `\x1b[33m  ➜ 🚀Connection to \x1b[96m${process.env.PG_DB}\x1b[33m has been established successfully.\x1b[0m`,
      );
      client.release();

      cancelExpiredBookings();
      setInterval(cancelExpiredBookings, ONE_DAY);
    })
    .catch(error => {
      console.log(`Connection to \x1b[96m${process.env.PG_DB}\x1b[0m was failed:`, error.message);
    });
 */
  console.log(`\x1b[33m  ➜ ✨ Server is listening on port: \x1b[96m${PORT}\x1b[0m`)
})
