export type TStatName = 'ip' | 'referer' | 'host' | 'platform' | 'agent' | 'title' | 'color' | 'type'
export const statNames: TStatName[] = ['ip', 'referer', 'host', 'platform', 'agent', 'title', 'color', 'type']
export type TStats = Partial<Record<TStatName, Record<string, number>>> & { total: number; visits: number }
