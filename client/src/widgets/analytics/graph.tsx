import { React } from '../../../utils/deps.ts'
import { GridChart } from '../../ui/chart/grid.tsx'

const currMonthDays = new Date().getDate()
const lastMonthDays = new Date(new Date().setMonth(new Date().getMonth(), 0)).getDate()

type TGraphProps = {
  data: Record<string, number>
  period: number
  lastMonth: number
  currMonth: number
  total: number
}

export default function AnalyticsGraph({ data, period, lastMonth, currMonth, total }: TGraphProps) {
  const averageLastMonth = lastMonth / lastMonthDays
  const averageCurrMonth = currMonth / currMonthDays
  const percent = ((averageCurrMonth - averageLastMonth) / (averageLastMonth || 1)) * 100
  const grow = percent > 0
  return (
    <div className="analytics">
      <div className="analytics__total">
        <span>{`Period: ${period}`}</span>
        <span>{`Total: ${total}`}</span>
        <span style={{ color: grow ? 'green' : 'red' }}>
          {percent.toFixed(0)}% {grow ? '▲' : '▼'}
        </span>
      </div>
      <GridChart data={data} />
    </div>
  )
}
