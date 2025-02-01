import { TCounter } from './types.ts'

export async function getCounters(): Promise<{ counters?: TCounter[]; error?: string }> {
  try {
    const res = await fetch('/api/counters')

    if (res.status !== 200) {
      return { error: await res.text() }
    }

    return { counters: await res.json() }
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) }
  }
}
