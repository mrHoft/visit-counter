import { signJWT, validateJWT } from '@cross/jwt'

const JWT_SECRET = Deno.env.get('JWT_SECRET')

export function createUserToken(name: string, password: string) {
  if (JWT_SECRET) {
    return signJWT({ user: name, password }, JWT_SECRET)
  }
  return Promise.reject()
}

export function createAdminUserToken() {
  return createUserToken(Deno.env.get('ADMIN_NAME') ?? 'admin', Deno.env.get('ADMIN_PWD') ?? 'admin')
}

export async function validateUser(token: string, password: string) {
  if (JWT_SECRET) {
    return (await validateJWT(token, JWT_SECRET)).password === password
  }
  return false
}
