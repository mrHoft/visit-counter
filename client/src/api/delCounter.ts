import { TCounter } from './types.ts'

export async function delCounter(
  data: { id: number },
): Promise<{ counter?: TCounter; error?: string }> {
  const res = await fetch(`/api/counter/${data.id}`, { method: 'DELETE' })

  if (res.status !== 200) {
    return { error: await res.text() }
  }

  return { counter: await res.json() }
}
