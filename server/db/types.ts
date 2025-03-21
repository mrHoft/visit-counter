export type TCounterType = 'badge' | 'number' | 'classic'

export type TCountersTableSchema = {
  id: number
  name: string
  value: number
  created_at: string
  created_by: string
  creator_id: number
}

export type TCounterTableSchema = {
  id: number
  created_at: string
  ip: string
  referer: string | null
  host: string
  platform: string
  agent: string
  title: string | null
  color: string | null
  type: string | null
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
  creator_id: number
}
