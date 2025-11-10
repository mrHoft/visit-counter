import { TCountersTableSchema, TUserRole, TUsersTableSchema } from '../../../server/db/types.ts'
export type TUser = Omit<TUsersTableSchema, 'token'> & { token?: string }
export { type TUserRole }
export type TCounter = TCountersTableSchema

export type TStatName = 'country' | 'platform' | 'agent' | 'mobile' | 'title' | 'color' | 'type'
export type TStatsData = Partial<Record<TStatName, Record<string, number>>> & {
  period: number
  lastMonth: number
  currMonth: number
  total: number
}

export type TGraphData = Record<string, number>
