import { React } from '../../../utils/deps.ts'
import { ButtonSubmit, ButtonSecondary } from '../../ui/button.tsx'
import type { TMode } from '../menu.tsx'
import { counterApi } from '../../api/counter.ts'
import { analyticsApi } from '../../api/analytics.ts'
import Message from '../message.tsx'
import Select from '../../ui/select.tsx'
import storeUser from '../../entities/user.ts'
import { statNames, type TStatsData, type TGraphData } from './const.ts'
import AnalyticsCharts from './charts.tsx'
import AnalyticsGraph from './graph.tsx'

type TAnalyticsProps = { modeChange: (mode: TMode) => void }

export default function PageAnalytics({ modeChange }: TAnalyticsProps) {
  const [counters, setCounters] = React.useState<string[]>([])
  const [stats, setStats] = React.useState<TStatsData>({ period: 0, lastMonth: 0, currMonth: 0, total: 0 })
  const [graph, setGraph] = React.useState<TGraphData | null>(null)
  const [loading, setLoading] = React.useState(false)

  const getCounters = () => {
    setLoading(true)
    counterApi
      .get()
      .then(({ data, error }) => {
        if (data) {
          if (storeUser.user?.role === 'admin') {
            setCounters(data.map(counter => counter.name))
          } else {
            setCounters(
              data
                .filter(counter => counter.creator_id === storeUser.user?.id || counter.name === storeUser.user?.name)
                .map(counter => counter.name),
            )
          }
        }
        if (error) Message.show(error, 'error')
      })
      .finally(() => setLoading(false))
  }

  const getAnalytics = ({ name }: { name: string }) => {
    setLoading(true)
    analyticsApi
      .get(name)
      .then(({ data: response, error }) => {
        if (response) {
          const { data, period, lastMonth, currMonth, total } = response
          const statsData: TStatsData = { period, lastMonth, currMonth, total }
          for (const stat of statNames) {
            statsData[stat] = data.reduce<Record<string, number>>((acc, row) => {
              const val = row[stat as keyof typeof row]
              if (val) {
                acc[val] = acc[val] ? acc[val] + 1 : 1
              }
              return acc
            }, {})
          }
          setStats(statsData)

          const graphData: TGraphData = data.reduce<Record<string, number>>((acc, row) => {
            const timestamp = row.created_at.slice(5, 10)
            acc[timestamp] = acc[timestamp] ? acc[timestamp] + 1 : 1
            return acc
          }, {})
          setGraph(graphData)
        }
        if (error) Message.show(error, 'error')
      })
      .finally(() => setLoading(false))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = formData.get('counter')!.toString()
    getAnalytics({ name })
  }

  React.useEffect(() => {
    getCounters()
  }, [])

  return (
    <>
      <div className="flex_wrap">
        <h3>Analytics</h3>
        {loading && <div className="button__loader" />}
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <Select options={counters} name="counter" placeholder="Select counter" required />
        <div className="form__btns">
          <ButtonSubmit>Get</ButtonSubmit>
          <ButtonSecondary onClick={() => modeChange('menu')}>Back</ButtonSecondary>
        </div>
      </form>
      {graph && (
        <AnalyticsGraph
          data={graph}
          total={stats.total}
          period={stats.period}
          lastMonth={stats.lastMonth}
          currMonth={stats.currMonth}
        />
      )}
      <AnalyticsCharts stats={stats} />
    </>
  )
}
