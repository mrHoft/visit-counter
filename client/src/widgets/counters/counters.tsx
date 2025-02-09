import { React } from '../../../utils/deps.ts'
import { ButtonSecondary } from '../../ui/button.tsx'
import type { TMode } from '../menu.tsx'
import type { TCounter } from '../../api/types.ts'
import { counterApi } from '../../api/counter.ts'
import { ButtonDel } from '../../ui/squareDel.tsx'
import { ButtonEdit } from '../../ui/squareEdit.tsx'
import CounterManage from './manage.tsx'
import CounterDelete from './del.tsx'
import Modal from '../modal.tsx'
import storeStats from '../../entities/stats.ts'
import Pagination from '../../ui/pagination.tsx'
import Message from '../../widgets/message.tsx'

const pageSize = 10
type TUsersSorting =
  | 'id_asc'
  | 'id_desc'
  | 'name_asc'
  | 'name_desc'
  | 'value_asc'
  | 'value_desc'
  | 'date_asc'
  | 'date_desc'
  | 'creator_asc'
  | 'creator_desc'
  | null
type TManageCountersProps = { modeChange: (mode: TMode) => void }

export default function ManageCounters({ modeChange }: TManageCountersProps) {
  const [counters, setCounters] = React.useState<TCounter[]>([])
  const [page, setPage] = React.useState(0)
  const [loading, setLoading] = React.useState(false)
  const [sorting, setSorting] = React.useState<TUsersSorting>('id_desc')
  const [sortingField, sortingOrder] = sorting ? sorting.split('_') : [null, 'asc']

  const countersPage = (
    !sorting
      ? counters
      : counters.sort((a, b) => {
          const dir = sortingOrder === 'asc' ? 1 : -1
          if (sortingField === 'name') {
            if (a.name > b.name) return dir
            return -dir
          }
          if (sortingField === 'value') {
            if (a.value > b.value) return dir
            return -dir
          }
          if (sortingField === 'date') {
            if (a.created_at > b.created_at) return -dir
            return dir
          }
          if (sortingField === 'creator') {
            if (a.created_by > b.created_by) return -dir
            return dir
          }
          if (a.id > b.id) return -dir
          return dir
        })
  ).slice(page * pageSize, (page + 1) * pageSize)

  const tableUptate = () => {
    setLoading(true)
    counterApi
      .get()
      .then(({ data, error }) => {
        if (data) {
          setCounters(data)
          const requests = data.reduce((acc, counter) => acc + counter.value, 0)
          storeStats.stats = { ...storeStats.stats, counters: data.length, requests }
        }
        if (error) Message.show(error, 'error')
      })
      .finally(() => setLoading(false))
  }

  const handleCounterAdd = () => {
    Modal.show(<CounterManage onSuccess={tableUptate} />)
  }

  const handleCounterEdit = (id: number) => () => {
    const counter = counters.find(item => item.id === id)
    if (counter) {
      Modal.show(<CounterManage counter={counter} onSuccess={tableUptate} />)
    }
  }

  const handleCounterDelete = (id: number) => () => {
    const counter = counters.find(item => item.id === id)
    if (counter) {
      Modal.show(<CounterDelete counter={counter} onSuccess={tableUptate} />)
    }
  }

  const getDirection = (field: string) => {
    if (sortingField === field) {
      return <span>{sortingOrder === 'asc' ? ' ▲' : ' ▼'}</span>
    }
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
            <th onClick={() => setSorting(prev => (prev === 'id_desc' ? 'id_asc' : 'id_desc'))}>
              id
              {getDirection('id')}
            </th>
            <th onClick={() => setSorting(prev => (prev === 'name_desc' ? 'name_asc' : 'name_desc'))}>
              Name
              {getDirection('name')}
            </th>
            <th onClick={() => setSorting(prev => (prev === 'value_desc' ? 'value_asc' : 'value_desc'))}>
              Value
              {getDirection('value')}
            </th>
            <th onClick={() => setSorting(prev => (prev === 'date_desc' ? 'date_asc' : 'date_desc'))}>
              Created
              {getDirection('date')}
            </th>
            <th onClick={() => setSorting(prev => (prev === 'creator_desc' ? 'creator_asc' : 'creator_desc'))}>
              By
              {getDirection('creator')}
            </th>
            <th>{`Total: ${counters.length}`}</th>
          </tr>
        </thead>
        <tbody>
          {countersPage.map(counter => (
            <tr key={counter.id}>
              <td>{counter.id}</td>
              <td>{counter.name}</td>
              <td>{counter.value}</td>
              <td>{counter.created_at.slice(0, 10)}</td>
              <td>{counter.created_by}</td>
              <td className="table__manage">
                <ButtonDel disabled={loading} onClick={handleCounterDelete(counter.id)} />
                <ButtonEdit disabled={loading} onClick={handleCounterEdit(counter.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination page={page} total={counters.length} pageSize={pageSize} onChange={setPage} />
      <div className="flex_wrap" style={{ marginTop: '1rem' }}>
        <ButtonSecondary onClick={handleCounterAdd}>Add</ButtonSecondary>
        <ButtonSecondary onClick={() => modeChange('menu')}>Back</ButtonSecondary>
      </div>
    </>
  )
}
