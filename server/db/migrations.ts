import { Client } from 'postgres'

export async function runMigrations(client: Client) {
  await client.queryObject(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version VARCHAR(20) PRIMARY KEY,
      filename VARCHAR(255) NOT NULL,
      applied_at TIMESTAMP DEFAULT NOW()
    );
  `)

  const migrationFiles: string[] = []
  const migrationFolder = new URL('./migrations', import.meta.url).pathname
  // console.log('Migration folder:', migrationFolder)
  for await (const dirEntry of Deno.readDir(migrationFolder)) {
    if (dirEntry.isFile && dirEntry.name.endsWith('.sql')) {
      migrationFiles.push(dirEntry.name)
    }
  }

  migrationFiles.sort((a, b) => {
    const aNum = parseInt(a.split('_')[0])
    const bNum = parseInt(b.split('_')[0])
    return aNum - bNum
  })

  const appliedResult = await client.queryObject<{ version: string; filename: string }>(
    'SELECT version, filename FROM schema_migrations ORDER BY version;',
  )
  const appliedMigrations = new Map(
    appliedResult.rows.map((row) => [row.version, row.filename]),
  )

  if (!migrationFiles.length) {
    console.log('  No migrations to apply.')
    return
  }

  for (const filename of migrationFiles) {
    const version = filename.split('_')[0]

    if (appliedMigrations.has(version)) {
      console.log(`\x1b[33m  ✓ Migration \x1b[36m${filename}\x1b[33m already applied\x1b[0m`)
      continue
    }

    console.log(`\x1b[33m  Applying migration: \x1b[36m${filename}\x1b[33m...\x1b[0m`)

    try {
      const migrationSql = await Deno.readTextFile(`./db/migrations/${filename}`)

      await client.queryObject('BEGIN')
      await client.queryObject(migrationSql)

      await client.queryObject(
        'INSERT INTO schema_migrations (version, filename) VALUES ($1, $2);',
        [version, filename],
      )

      await client.queryObject('COMMIT')
      console.log(`\x1b[33m  ✓ Successfully applied migration: \x1b[36m${filename}\x1b[0m`)
    } catch (error) {
      await client.queryObject('ROLLBACK')
      console.error(`\x1b[31m  ✗ Failed to apply migration \x1b[36m${filename}\x1b[0m:`, error)
      throw error
    }
  }

  console.log('\x1b[32m  All migrations completed successfully!\x1b[0m')
}
