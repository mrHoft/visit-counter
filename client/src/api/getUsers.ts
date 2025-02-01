import { TUser } from './types.ts'

export async function getUsers(): Promise<{ users?: TUser[]; error?: string }> {
  try {
    const res = await fetch('/api/users')

    if (res.status !== 200) {
      return { error: await res.text() }
    }

    return { users: await res.json() }
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) }
  }
}
