import { TCounter } from './types.ts'

export async function addCounter(
  data: { name: string; value: string },
): Promise<{ counter?: TCounter; error?: string }> {
  const res = await fetch('/api/counter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (res.status !== 200) {
    return { error: await res.text() }
  }

  return { counter: await res.json() }
}
