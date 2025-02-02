import { fetcher } from './fetcher.ts'
import { type TCounter } from './types.ts'

export const counterApi = {
  get: () => fetcher<TCounter[]>({ url: '/api/counters' }),
  add: (data: { name: string; value: string }) => fetcher<TCounter>({ url: '/api/counter', method: 'POST', data }),
  del: (data: { id: number }) => fetcher<TCounter>({ url: `/api/counter/${data.id}`, method: 'DELETE' }),
  edit: (data: { id: number; name: string; value: string }) =>
    fetcher<TCounter>({ url: `/api/counter/${data.id}`, method: 'PUT', data }),
}
