import { TCounter } from './types.ts'

export async function editCounter(
  data: { id: number; name: string; value: string },
): Promise<{ counter?: TCounter; error?: string }> {
  try {
    const res = await fetch(`/api/counter/${data.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (res.status !== 200) {
      return { error: await res.text() }
    }

    return { counter: await res.json() }
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) }
  }
}
