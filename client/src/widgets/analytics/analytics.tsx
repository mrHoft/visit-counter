import { React } from '../../../utils/deps.ts'
import { statNames, type TStatName, type TStats } from './const.ts'

export default function Analytics({ stats }: { stats: TStats }) {
  if (stats.total === 0) return null

  const getStat = (name: TStatName) => {
    const stat = stats[name]
    if (!stat) return null
    return Object.keys(stat).reduce((acc, key) => `${acc}${key}: ${stat[key]}\n`, '')
  }

  return (
    <table className="analytincs">
      <tbody>
        {statNames.map((name: TStatName) => (
          <tr key={name}>
            <td>{name}</td>
            <td>{getStat(name)}</td>
            <td></td>
          </tr>
        ))}
        <tr>
          <td>Total</td>
          <td></td>
          <td>{stats.total}</td>
        </tr>
        <tr>
          <td>Visits</td>
          <td></td>
          <td>{stats.visits}</td>
        </tr>
      </tbody>
    </table>
  )
}
