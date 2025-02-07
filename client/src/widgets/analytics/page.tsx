import { React } from '../../../utils/deps.ts'
import { ButtonSubmit, ButtonSecondary } from '../../ui/button.tsx'
import type { TMode } from '../menu.tsx'
import { counterApi } from '../../api/counter.ts'
import { analyticsApi } from '../../api/analytics.ts'
import Message from '../message.tsx'
import Select from '../../ui/select.tsx'
import storeUser from '../../entities/user.ts'
import { statNames, type TStats } from './const.ts'
import Analytics from './analytics.tsx'

type TAnalyticsProps = { modeChange: (mode: TMode) => void }

export default function PageAnalytics({ modeChange }: TAnalyticsProps) {
  const [counters, setCounters] = React.useState<string[]>([])
  const [stats, setStats] = React.useState<TStats>({ total: 0, visits: 0 })
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
            setCounters(data.filter(counter => counter.creator_id === storeUser.user?.id).map(counter => counter.name))
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
          const { data, total, visits } = response
          const collect: TStats = { total, visits }
          for (const stat of statNames) {
            collect[stat] = data.reduce<Record<string, number>>((acc, row) => {
              const val = row[stat]
              if (val) {
                acc[val] = acc[val] ? acc[val] + 1 : 1
              }
              return acc
            }, {})
          }
          setStats(collect)
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
      <Analytics stats={stats} />
    </>
  )
}
