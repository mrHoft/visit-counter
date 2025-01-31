import { signJWT, validateJWT } from '@cross/jwt'

const JWT_SECRET = Deno.env.get('JWT_SECRET')

export function createAdminUserToken() {
  if (JWT_SECRET) {
    return signJWT(
      { user: Deno.env.get('ADMIN_NAME') ?? 'admin', password: Deno.env.get('ADMIN_PWD') ?? 'admin' },
      JWT_SECRET,
    )
  }
  return Promise.reject()
}

export async function validateUser(token: string, password: string) {
  if (JWT_SECRET) {
    return (await validateJWT(token, JWT_SECRET)).password === password
  }
  return false
}
