import { fetcher } from './fetcher.ts'
import { type TUser, type TUserRole } from './types.ts'

type TUserPayload = { id?: number; name: string; password?: string; email: string; role: TUserRole }

export const userApi = {
  get: () => fetcher<TUser[]>({ url: '/api/users' }),
  add: (data: TUserPayload) => fetcher<TUser>({ url: '/api/user', method: 'POST', data }),
  del: (data: { id: number }) => fetcher<TUser>({ url: `/api/user/${data.id}`, method: 'DELETE' }),
  edit: (data: TUserPayload) => fetcher<TUser>({ url: `/api/user/${data.id}`, method: 'PUT', data }),
}
