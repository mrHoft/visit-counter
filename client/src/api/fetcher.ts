import storeStats from '../entities/stats.ts'

type TMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
type TFetcherProps = {
  url: string
  method?: TMethod
  headers?: Record<string, string>
  data?: Record<string, unknown>
}
type TPayload = {
  method: TMethod
  headers: Record<string, string>
  body?: string
}

export async function fetcher<T>(
  { url, method = 'GET', headers, data }: TFetcherProps,
): Promise<{ data?: T; error?: string }> {
  const APP_HOST = storeStats.stats.host
  console.log(APP_HOST)

  const payload: TPayload = {
    method,
    headers: headers ?? { 'Content-Type': 'application/json' },
  }

  if (data) payload.body = JSON.stringify(data)

  try {
    const res = await fetch(`${APP_HOST}${url}`, payload)

    if (res.status !== 200) {
      return { error: await res.text() }
    }

    return { data: await res.json() }
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) }
  }
}
