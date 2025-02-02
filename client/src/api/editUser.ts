import { TUser, TUserRole } from './types.ts'

type TUserPayload = { id?: number; name: string; password?: string; email: string; role: TUserRole }

export async function editUser(data: TUserPayload): Promise<{ user?: TUser; error?: string }> {
  if (!data.id) return { error: 'User ID is required' }

  try {
    const res = await fetch(`/api/user/${data.id}`, {
      method: 'PUT',
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
