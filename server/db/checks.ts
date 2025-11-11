import { Client, Pool } from 'postgres'

import { dbConfig } from './config.ts'
import { createAdminUserToken } from '~/server/utils/token.ts'
import { ERROR_CODES } from '~/server/db/codes.ts'
import { initTableCounters, initTableUsers, initTriggers } from './const.ts'
import { runMigrations } from './migrations.ts'

async function initializeDatabase() {
  let client: Client | null = null

  try {
    const systemClient = new Client({
      ...dbConfig,
      database: 'postgres',
      user: 'postgres',
      password: Deno.env.get('PG_PWD'),
    }) // Connect to default system database
    await systemClient.connect()

    const userExists = await systemClient.queryObject<{ exists: boolean }>(
      `SELECT EXISTS(SELECT 1 FROM pg_roles WHERE rolname = $1)`,
      [dbConfig.user],
    )
      .then(({ rows }) => rows[0].exists)

    if (!userExists) {
      console.log(`\x1b[33mCreating user: \x1b[36m${dbConfig.user}\x1b[33m...\x1b[0m`)
      await systemClient.queryObject(
        `CREATE USER ${dbConfig.user} WITH PASSWORD '${dbConfig.password}' SUPERUSER`,
      )
        .then(() => {
          console.log(`\x1b[32m  Database user create: Success!\x1b[0m`)
        })
        .catch((error) => {
          console.log(`\x1b[31m  Database user create: Fail:\x1b[0m`, error.message)
          throw error
        })
    }

    const dbExistsResult = await systemClient.queryObject<{ exists: boolean }>(
      `SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname = $1)`,
      [dbConfig.database],
    )

    if (!dbExistsResult.rows[0].exists) {
      console.log(`\x1b[33mCreating database: \x1b[36m${dbConfig.database}\x1b[33m...\x1b[0m`)
      await systemClient.queryObject(`CREATE DATABASE ${dbConfig.database}`)
      console.log(`\x1b[32m  Database create: Success!\x1b[0m`)
    }

    await systemClient.end()

    client = await new Pool(dbConfig, 10).connect()

    console.log('\x1b[33mCreating \x1b[36mpgcrypto\x1b[33m extension...\x1b[0m')
    await client.queryObject(`
      CREATE EXTENSION IF NOT EXISTS pgcrypto;
    `)

    console.log('\x1b[33mRunning database migrations...\x1b[0m')
    await runMigrations(client)

    console.log('\x1b[32mDatabase initialization: Success!\x1b[0m')
  } catch (error) {
    console.error('\x1b[31mDatabase initialization: Failed:\x1b[0m', error)
    throw error
  } finally {
    if (client) {
      await client.end()
    }
  }
}

async function createCountersTable() {
  const client = await new Pool(dbConfig, 10).connect()

  return client.queryObject(initTableCounters).then(() => {
    console.log('\x1b[32m  Create counters table: Success!\x1b[0m')
  }).catch((err) => {
    console.log('\x1b[31m  Create counters table: Failed:\x1b[0m', err.message)
  }).then(async () => {
    await client.end()
    return 1
  })
}

async function checkCountersTable() {
  const client = await new Pool(dbConfig, 10).connect()

  return client.queryObject<Record<'name', string>>('SELECT name FROM counters;')
    .then(async ({ rows }) => {
      console.log('Available counters:', rows.map(({ name }) => name).join(', '))
      await client.end()
      return 0
    })
    .catch(async (error) => {
      if (error.fields.code === ERROR_CODES.relation) {
        console.log('No counters table found: creating one...')
        await client.end()
        return await createCountersTable()
      }
      await client.end()
      return 0
    })
}

async function createUsersTable() {
  const client = await new Pool(dbConfig, 10).connect()

  client.queryObject(initTableUsers).then(() => {
    console.log('\x1b[32m  Create users table: Success!\x1b[0m')
  }).catch((err) => {
    console.log('\x1b[31m  Create users table: Failed:\x1b[0m', err.message)
  })
    .finally(async () => await client.end())
}

async function createDefaultUser() {
  console.log('Creating default user...')

  const token = await createAdminUserToken()
  if (token) {
    const client = await new Pool(dbConfig, 10).connect()

    client.queryObject(/* sql */ `
      INSERT INTO users (name, role, token) VALUES ('${
      Deno.env.get('ADMIN_NAME') ?? 'admin'
    }', 'admin', '${token}') RETURNING *;`)
      .then(({ rows }) => {
        if (rows.length) console.log('\x1b[32m  Create default user: Success!\x1b[0m')
      })
      .catch((err) => console.log('\x1b[31m  Create default user: Failed:\x1b[0m', err.message))
      .finally(async () => await client.end())
  }
}

async function checkUsersTable() {
  const client = await new Pool(dbConfig, 10).connect()

  return client.queryObject<Record<'name', string>>('SELECT name FROM users;')
    .then(async ({ rows }) => {
      if (!rows.length) createDefaultUser()
      else console.log('Available users:', rows.map(({ name }) => name).join(', '))
      await client.end()
      return 0
    })
    .catch(async (error) => {
      if (error.fields.code === ERROR_CODES.relation) {
        console.log('No users table found: creating one...')
        await createUsersTable().then(() => createDefaultUser())
        await client.end()
        return 1
      } else {
        console.log(`\x1b[31mConnection to \x1b[36m${Deno.env.get('PG_DB')}\x1b[31m was failed:\x1b[0m`, error.message)
      }
      await client.end()
      return 0
    })
}

export async function checkDatabase() {
  await initializeDatabase()

  const changes = await checkUsersTable() + await checkCountersTable()
  if (changes) {
    const client = await new Pool(dbConfig, 10).connect()
    await client.connect()

    client.queryObject(initTriggers).then(() => {
      console.log('\x1b[33mCreate database triggers: Success!\x1b[0m')
    }).catch((err) => {
      console.log('\x1b[31mCreate database triggers: Failed:\x1b[0m', err.message)
    }).finally(async () => await client.end())
  }
}
