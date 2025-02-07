import { fetcher } from './fetcher.ts'
import { type TCounterTableSchema } from '~/server/db/types.ts'

export type TAnalytics = {
  data: TCounterTableSchema[]
  total: number
  visits: number
}

export const analyticsApi = {
  get: (name: string) => fetcher<TAnalytics>({ url: `/api/analytics/${name}` }),
}
