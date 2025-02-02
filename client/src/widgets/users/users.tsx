import { React } from '../../../utils/deps.ts'
import { ButtonSecondary } from '../../ui/button.tsx'
import type { TMode } from '../menu.tsx'
import type { TUser } from '../../api/types.ts'
import { userApi } from '../../api/user.ts'
import { ButtonDel } from '../../ui/squareDel.tsx'
import { ButtonEdit } from '../../ui/squareEdit.tsx'
import UserManage from './manage.tsx'
import UserDelete from './del.tsx'
import Modal from '../modal.tsx'
import storeStats from '../../entities/stats.ts'
import Pagination from '../../ui/pagination.tsx'
import Message from '../message.tsx'

const pageSize = 10
type TUsersSorting =
  | 'id_asc'
  | 'id_desc'
  | 'name_asc'
  | 'name_desc'
  | 'role_asc'
  | 'role_desc'
  | 'date_asc'
  | 'date_desc'
  | 'creator_asc'
  | 'creator_desc'
  | null
type TManageUsersProps = { modeChange: (mode: TMode) => void }

export default function ManageUsers({ modeChange }: TManageUsersProps) {
  const [users, setUsers] = React.useState<TUser[]>([])
  const [page, setPage] = React.useState(0)
  const [loading, setLoading] = React.useState(false)
  const [sorting, setSorting] = React.useState<TUsersSorting>('id_desc')
  const [sortingField, sortingOrder] = sorting ? sorting.split('_') : [null, 'asc']

  const usersPage = (
    !sorting
      ? users
      : users.sort((a, b) => {
          const dir = sortingOrder === 'asc' ? 1 : -1
          if (sortingField === 'name') {
            if (a.name > b.name) return dir
            return -dir
          }
          if (sortingField === 'role') {
            if (a.role > b.role) return dir
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
    userApi
      .get()
      .then(({ data, error }) => {
        if (data) {
          setUsers(data)
          storeStats.stats = { ...storeStats.stats, users: data.length }
        }
        if (error) Message.show(error, 'error')
      })
      .finally(() => setLoading(false))
  }

  const handleUserAdd = () => {
    Modal.show(<UserManage onSuccess={tableUptate} />)
  }

  const handleUserEdit = (id: number) => () => {
    const user = users.find(item => item.id === id)
    if (user) {
      Modal.show(<UserManage user={user} onSuccess={tableUptate} />)
    }
  }

  const handleUserDelete = (id: number) => () => {
    const user = users.find(item => item.id === id)
    if (user) {
      Modal.show(<UserDelete user={user} onSuccess={tableUptate} />)
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
        <h3>Manage users</h3>
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
            <th onClick={() => setSorting(prev => (prev === 'role_desc' ? 'role_asc' : 'role_desc'))}>
              Role
              {getDirection('role')}
            </th>
            <th onClick={() => setSorting(prev => (prev === 'date_desc' ? 'date_asc' : 'date_desc'))}>
              Created
              {getDirection('date')}
            </th>
            <th onClick={() => setSorting(prev => (prev === 'creator_desc' ? 'creator_asc' : 'creator_desc'))}>
              By
              {getDirection('creator')}
            </th>
            <th>{`Total: ${users.length}`}</th>
          </tr>
        </thead>
        <tbody>
          {usersPage.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.role}</td>
              <td>{user.created_at.slice(0, 10)}</td>
              <td>{user.created_by}</td>
              <td className="table__manage">
                <ButtonDel disabled={loading} onClick={handleUserDelete(user.id)} />
                <ButtonEdit disabled={loading} onClick={handleUserEdit(user.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination page={page} total={users.length} pageSize={pageSize} onChange={setPage} />
      <div className="flex_wrap" style={{ marginTop: '1rem' }}>
        <ButtonSecondary onClick={handleUserAdd}>Add</ButtonSecondary>
        <ButtonSecondary onClick={() => modeChange('menu')}>Back</ButtonSecondary>
      </div>
    </>
  )
}
