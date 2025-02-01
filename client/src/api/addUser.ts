import { TUser, TUserRole } from './types.ts'

export async function addUser(
  data: { name: string; password: string; email: string; role: TUserRole },
): Promise<{ user?: TUser; error?: string }> {
  try {
    const res = await fetch('/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (res.status !== 200) {
      return { error: await res.text() }
    }

    return { user: await res.json() }
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) }
  }
}
