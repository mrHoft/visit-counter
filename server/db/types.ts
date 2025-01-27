export type TCounterType = 'badge' | 'number' | 'classic'

export type TCountersTableSchema = {
  id: number
  name: string
  value: number
  created_at: string
  created_by: string
}

export type TUserRole = 'admin' | 'user' | 'guest'

export type TUsersTableSchema = {
  id: number
  name: string
  email: string | null
  token: string
  role: TUserRole
  created_at: string
  updated_at: string
  created_by: string
}
