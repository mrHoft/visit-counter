export type TStatName = 'ip' | 'platform' | 'agent' | 'title' | 'color' | 'type'
export const statNames: TStatName[] = ['ip', 'platform', 'agent', 'title', 'color', 'type']
export type TStats = Partial<Record<TStatName, Record<string, number>>> & {
  period: number
  lastMonth: number
  currMonth: number
  total: number
}
