import { React } from '../../utils/deps.ts'

export default function Header({ authorized }: { authorized?: boolean }) {
  return (
    <header className="header flex_wrap">
      <h1>Counter</h1>
      {authorized && <div>admin panel</div>}
    </header>
  )
}
