import db from '~/server/utils/pool.ts'
import { createAdminUserToken } from '~/server/utils/users.ts'
import { ERROR_CODES } from '~/server/db/codes.ts'

async function createCountersTable() {
  console.log('No counters table found: creating one...')

  await db.pool.query(/* sql */ `
    CREATE TABLE IF NOT EXISTS counters (
      id serial PRIMARY KEY,
      name varchar(25) NOT NULL UNIQUE,
      value int4 NOT NULL DEFAULT 0,
      created_at timestamptz NOT NULL DEFAULT now(),
      created_by varchar(25) NOT NULL DEFAULT 'default'
    );`)
}

async function createDefaultCounters() {
  console.log('Creating default counters...')

  const { rows } = await db.pool.query(/* sql */ `
    INSERT INTO counters (name) VALUES ('default'), ('counter-example') ON CONFLICT DO NOTHING RETURNING *;`)
  if (rows.length) console.log('Success!')
}

function checkCountersTable() {
  db.pool
    .query<Record<'name', string>>('SELECT name FROM counters;')
    .then(({ rows }) => {
      console.log('Available counters:', rows.map(({ name }) => name).join(', '))
    })
    .catch(async (error) => {
      if (error.code === ERROR_CODES.relation) {
        try {
          await createCountersTable()
          await createDefaultCounters()
        } catch (e) {
          console.log(e instanceof Error ? e.message : e)
        }
      } else {
        console.log(`Connection to \x1b[96m${Deno.env.get('PG_DB')}\x1b[0m was failed:`, error.message)
      }
    })
}

async function createUsersTable() {
  console.log('No users table found: creating one...')

  await db.pool.query(/* sql */ `
      DO $$ BEGIN
        CREATE TYPE role AS ENUM ('admin', 'user', 'guest');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      CREATE TABLE IF NOT EXISTS users (
        id serial PRIMARY KEY,
        name varchar(25) NOT NULL UNIQUE,
        email varchar(25),
        role role NOT NULL DEFAULT 'user',
        token varchar(256) NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        created_by varchar(25) NOT NULL DEFAULT 'default'
      );`)
}

async function createDefaultUser() {
  console.log('Creating default user...')

  const token = await createAdminUserToken()
  if (token) {
    const { rows } = await db.pool.query(/* sql */ `
      INSERT INTO users (name, role, token) VALUES ('${
      Deno.env.get('ADMIN_NAME') ?? 'admin'
    }', 'admin', '${token}') RETURNING *;`)
    if (rows.length) console.log('Success!')
  }
}

function checkUsersTable() {
  db.pool
    .query<Record<'name', string>>('SELECT name FROM users;')
    .then(({ rows }) => {
      if (!rows.length) createDefaultUser()
      else console.log('Available users:', rows.map(({ name }) => name).join(', '))
    })
    .catch(async (error) => {
      if (error.code === ERROR_CODES.relation) {
        try {
          await createUsersTable()
          await createDefaultUser()
        } catch (e) {
          console.log(e instanceof Error ? e.message : e)
        }
      } else {
        console.log(`Connection to \x1b[96m${Deno.env.get('PG_DB')}\x1b[0m was failed:`, error.message)
      }
    })
}

export default function checkTables() {
  checkUsersTable()
  checkCountersTable()
}
