// @deno-types="npm:@types/pg-pool@2"
import Pool from 'pg-pool'
import { Client } from 'npm:@types/pg@8'

const config = {
  database: Deno.env.get('PG_DB'),
  user: Deno.env.get('PG_USER'),
  password: Deno.env.get('PG_PWD'),
  host: Deno.env.get('PG_URL'),
  port: 5432,
  ssl: true,
  max: 20, // set pool max size to 20
  idleTimeoutMillis: 1000, // close idle clients after 1 second
  connectionTimeoutMillis: 1000, // return an error after 1 second if connection could not be established
  maxUses: 7500, // close (and replace) a connection after it has been used 7500 times
}

class DB {
  public pool = new Pool(config)
  private _client: Client | null = null

  constructor() {
    this.pool.on('error', err => {
      console.error('Unexpected error on idle client', err)
      this.pool.end()
    })
    /*
    this.pool.on('connect', () => {
      console.log(
        `\x1b[33m  → 🚀Connection to \x1b[96m${config.database}\x1b[33m has been established successfully.\x1b[0m`,
      )
    })
 */
    this.pool.on('remove', () => {
      console.log(`\x1b[33m  → 🚀Connection to \x1b[96m${config.database}\x1b[33m has been removed.\x1b[0m`)
    })

    this.pool.on('acquire', () => {
      console.log(`\x1b[33m  → 🚀Connection to \x1b[96m${config.database}\x1b[33m has been acquired.\x1b[0m`)
    })
  }

  get client() {
    if (this._client) Promise.resolve(this._client)
    return this.pool.connect().then(client => {
      this._client = client
      return client
    })
  }
}

const db = new DB()
export default db
