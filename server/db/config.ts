const DEV = Deno.env.get('DEV_MODE')

function validateEnv() {
  const required = ['PG_URL', 'PG_DB', 'PG_USER', 'PG_USER_PWD']
  const missing = required.filter((key) => !Deno.env.get(key))

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}

validateEnv()

export const dbConfig = {
  hostname: Deno.env.get('PG_URL') || 'localhost',
  port: parseInt(Deno.env.get('PG_PORT') || '5432'),
  database: Deno.env.get('PG_DB'),
  user: Deno.env.get('PG_USER'),
  password: Deno.env.get('PG_USER_PWD'),
  tls: {
    enabled: !DEV,
  },
}
