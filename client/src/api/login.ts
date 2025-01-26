import { TUser } from './types.ts'

export async function login(
  { name, password }: { name: string; password: string },
): Promise<{ user?: TUser; error?: string }> {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, password }),
  })

  if (res.status !== 200) {
    return { error: await res.text() }
  }

  return { user: await res.json() }
}
