import { React } from '../../../utils/deps.ts'
import { ButtonSecondary } from '../../ui/button.tsx'
import type { TMode } from '../menu.tsx'
import type { TCounter } from '../../api/types.ts'
import { getCounters } from '../../api/getCounters.ts'
import { ButtonDel } from '../../ui/squareDel.tsx'
import { ButtonEdit } from '../../ui/squareEdit.tsx'
import CounterAdd from './add.tsx'
import Modal from '../modal.tsx'

type TManageCountersProps = { modeChange: (mode: TMode) => void }

export default function ManageCounters({ modeChange }: TManageCountersProps) {
  const [counters, setCounters] = React.useState<TCounter[]>([])
  const [loading, setLoading] = React.useState(false)

  const tableUptate = () => {
    setLoading(true)
    getCounters()
      .then(res => {
        if (res.counters) setCounters(res.counters)
        if (res.error) console.error(res.error)
      })
      .finally(() => setLoading(false))
  }

  const handleCounterAdd = () => {
    Modal.show(<CounterAdd onSuccess={tableUptate} />)
  }

  React.useEffect(() => {
    tableUptate()
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
            <th>By</th>
            <th>{`Total: ${counters.length}`}</th>
          </tr>
        </thead>
        <tbody>
          {counters.map(counter => (
            <tr key={counter.id}>
              <td>{counter.id}</td>
              <td>{counter.name}</td>
              <td>{counter.value}</td>
              <td>{counter.created_at.slice(0, 10)}</td>
              <td>{counter.created_by}</td>
              <td className="table__manage">
                <ButtonDel disabled={loading} />
                <ButtonEdit disabled={loading} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex_wrap" style={{ marginTop: '1rem' }}>
        <ButtonSecondary onClick={handleCounterAdd}>Add</ButtonSecondary>
        <ButtonSecondary onClick={() => modeChange('menu')}>Back</ButtonSecondary>
      </div>
    </>
  )
}
