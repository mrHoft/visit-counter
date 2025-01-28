import db from '~/server/utils/pool.ts'
import { createAdminUserToken } from '~/server/utils/users.ts'
import { ERROR_CODES } from '~/server/db/codes.ts'
import { initTableCounters, initTableUsers, initTriggers } from '~/server/db/init.ts'

const createCountersTable = () =>
  db.pool.query(initTableCounters).then(() => {
    console.log('Create counters table: Success!')
  }).catch((err) => {
    console.log('Create counters table: Failed:', err.message)
  }).then(() => 1)

const checkCountersTable = () =>
  db.pool
    .query<Record<'name', string>>('SELECT name FROM counters;')
    .then(({ rows }) => {
      console.log('Available counters:', rows.map(({ name }) => name).join(', '))
      return 0
    })
    .catch(async (error) => {
      if (error.code === ERROR_CODES.relation) {
        console.log('No counters table found: creating one...')
        return await createCountersTable()
      }
      return 0
    })

const createUsersTable = () =>
  db.pool.query(initTableUsers).then(() => {
    console.log('Create users table: Success!')
  }).catch((err) => {
    console.log('Create users table: Failed:', err.message)
  })

const createDefaultUser = async () => {
  console.log('Creating default user...')

  const token = await createAdminUserToken()
  if (token) {
    db.pool.query(/* sql */ `
      INSERT INTO users (name, role, token) VALUES ('${
      Deno.env.get('ADMIN_NAME') ?? 'admin'
    }', 'admin', '${token}') RETURNING *;`).then(({ rows }) => {
      if (rows.length) console.log('Create default user: Success!')
    }).catch((err) => console.log('Create default user: Failed:', err.message))
  }
}

const checkUsersTable = () =>
  db.pool
    .query<Record<'name', string>>('SELECT name FROM users;')
    .then(({ rows }) => {
      if (!rows.length) createDefaultUser()
      else console.log('Available users:', rows.map(({ name }) => name).join(', '))
      return 0
    })
    .catch((error) => {
      if (error.code === ERROR_CODES.relation) {
        console.log('No users table found: creating one...')
        createUsersTable().then(() => createDefaultUser())
        return 1
      } else {
        console.log(`Connection to \x1b[96m${Deno.env.get('PG_DB')}\x1b[0m was failed:`, error.message)
      }
      return 0
    })

export default async function checkTables() {
  const changes = await checkUsersTable() + await checkCountersTable()
  if (changes) {
    db.pool.query(initTriggers).then(() => {
      console.log('Create database triggers: Success!')
    }).catch((err) => {
      console.log('Create database triggers: Failed:', err.message)
    })
  }
}
