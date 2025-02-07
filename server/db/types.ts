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
  timestamp: string
  ip: string
  referer: string
  host: string
  platform: string
  agent: string
  title: string
  color: string
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
