export type TStatName = 'country' | 'platform' | 'agent' | 'mobile' | 'title' | 'color' | 'type'
export const statNames: TStatName[] = ['country', 'platform', 'agent', 'mobile', 'title', 'color', 'type']
export type TStats = Partial<Record<TStatName, Record<string, number>>> & {
  period: number
  lastMonth: number
  currMonth: number
  total: number
}
