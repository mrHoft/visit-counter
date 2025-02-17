import { React } from '../../../utils/deps.ts'
import { statNames, type TStatName, type TStats } from './const.ts'
import Toggle from '../../ui/toggle.tsx'
import { PieChart } from '../../ui/chart/pie.tsx'

const toggleOptions = statNames.map((name: TStatName, id) => ({ id, label: name }))

export default function AnalyticsCharts({ stats }: { stats: TStats }) {
  if (stats.total === 0) return null
  const [stat, setStat] = React.useState<TStatName>('country')

  const handleToggle = (id?: number) => {
    if (id !== undefined) {
      setStat(statNames[id])
    }
  }

  return (
    <div className="analytincs">
      <Toggle options={toggleOptions} defChecked={0} onChange={handleToggle} />
      <div style={{ marginTop: '1rem' }}>
        <PieChart data={stats[stat]!} total={stats.period} />
      </div>
    </div>
  )
}
