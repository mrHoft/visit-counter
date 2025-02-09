import { fetcher } from './fetcher.ts'
import { type TCounter } from './types.ts'

type TCounterPayload = { id?: number; name: string; value: string }

export const counterApi = {
  get: () => fetcher<TCounter[]>({ url: '/api/counters' }),
  add: (data: TCounterPayload) => fetcher<TCounter>({ url: '/api/counter', method: 'POST', data }),
  del: (data: { id: number }) => fetcher<TCounter>({ url: `/api/counter/${data.id}`, method: 'DELETE' }),
  edit: (data: TCounterPayload) => fetcher<TCounter>({ url: `/api/counter/${data.id}`, method: 'PUT', data }),
}
