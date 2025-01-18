import db from '~/server/utils/pool.ts'

export default function logAvailableCounters() {
  db.pool
    .query<Record<'name', string>>('SELECT name FROM counter;')
    .then(({ rows }) => {
      console.log('Available counters:', rows.map(({ name }) => name).join(', '))
    })
    .catch((error) => {
      console.log(`Connection to \x1b[96m${Deno.env.get('PG_DB')}\x1b[0m was failed:`, error.message)
    })
}
