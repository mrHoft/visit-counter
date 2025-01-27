import { React } from '../../utils/deps.ts'
import { ButtonSecondary } from '../ui/button.tsx'
import type { TMode } from './menu.tsx'
import type { TCounter } from '../api/types.ts'
import { getCounters } from '../api/getCounters.ts'
import { ButtonDel } from '../ui/squareDel.tsx'
import { ButtonEdit } from '../ui/squareEdit.tsx'

type TManageCountersProps = { modeChange: (mode: TMode) => void }

export default function ManageCounters({ modeChange }: TManageCountersProps) {
  const [counters, setCounters] = React.useState<TCounter[]>([])
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    setLoading(true)
    getCounters()
      .then(res => {
        if (res.counters) setCounters(res.counters)
        if (res.error) console.error(res.error)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <div className="flex_wrap">
        <h3>Manage counters</h3>
        {loading && <div className="button__loader" />}
      </div>
      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>Name</th>
            <th>Value</th>
            <th>Created</th>
            <th>{`Total: ${counters.length}`}</th>
          </tr>
        </thead>
        <tbody>
          {counters.map(counter => (
            <tr key={counter.id}>
              <td>{counter.id}</td>
              <td>{counter.name}</td>
              <td>{counter.value}</td>
              <td>{counter.created_at}</td>
              <td className="table__manage">
                <ButtonDel disabled={loading} />
                <ButtonEdit disabled={loading} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex_wrap" style={{ marginTop: '1rem' }}>
        <ButtonSecondary>Add</ButtonSecondary>
        <ButtonSecondary onClick={() => modeChange('menu')}>Back</ButtonSecondary>
      </div>
    </>
  )
}
