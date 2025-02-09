import { fetcher } from './fetcher.ts'
import { type TCounterTableSchema } from '~/server/db/types.ts'

export type TAnalytics = {
  data: TCounterTableSchema[]
  period: number
  lastMonth: number
  currMonth: number
  total: number
}

export const analyticsApi = {
  get: (name: string) => fetcher<TAnalytics>({ url: `/api/analytics/${name}` }),
}
