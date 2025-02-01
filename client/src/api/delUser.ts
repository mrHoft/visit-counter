import { TUser } from './types.ts'

export async function delUser(
  data: { id: number },
): Promise<{ user?: TUser; error?: string }> {
  try {
    const res = await fetch(`/api/user/${data.id}`, { method: 'DELETE' })

    if (res.status !== 200) {
      return { error: await res.text() }
    }

    return { user: await res.json() }
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) }
  }
}
