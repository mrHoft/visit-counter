import { fetcher } from './fetcher.ts'
import { type TUser } from './types.ts'

export function login(data: { name: string; password: string }) {
  return fetcher<TUser>({ url: '/api/login', method: 'POST', data })
}
