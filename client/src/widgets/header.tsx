import { React } from '../../utils/deps.ts'
import type { TUser } from '../api/types.ts'

export default function Header({ user }: { user?: TUser }) {
  return (
    <header className="header flex_wrap">
      <h1>Counter</h1>
      {user !== undefined && <div>{user.role} panel</div>}
    </header>
  )
}
