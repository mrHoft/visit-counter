import { React } from '../../utils/deps.ts' // Relative path for deno bundler
import { TUser } from '../api/types.ts'
import storeUser from '../entities/user.ts'
import storeStats, { type TStats } from '../entities/stats.ts'

export type TMode = 'login' | 'menu' | 'counters' | 'users' | 'analytics'

type TMunuProps = { user: TUser; server?: boolean; modeChange: (mode: TMode) => void }
const defaultStats = { counters: 0, users: 0, requests: 0, host: '', ip: '', version: '' }

export default function MainMenu({ user, server, modeChange }: TMunuProps) {
  const [isClient, setIsClient] = server ? [false, () => {}] : React.useState(false)
  const [stats, setStats] = server ? [defaultStats, () => {}] : React.useState<TStats>(defaultStats)

  if (!server) {
    React.useEffect(() => {
      setIsClient(true)
      setStats(storeStats.stats)
      storeStats.on('update', () => {
        setStats(storeStats.stats)
      })
    }, [])
  }

  const handleLogout = () => {
    storeUser.user = undefined
  }

  const handleModeCounters = () => {
    if (user.role !== 'admin') {
      alert('No rights to manage counters')
      return
    }
    modeChange('counters')
  }

  const handleModeUsers = () => {
    if (user.role !== 'admin') {
      alert('No rights to manage users')
      return
    }
    modeChange('users')
  }

  const handleAnalytics = () => {
    modeChange('analytics')
  }

  return (
    <div className="menu">
      <div className="menu__stats">
        <div className="menu__stat_item">
          <div>Status</div>
          <div style={{ color: isClient ? 'green' : 'red' }}>{isClient ? 'online' : 'offline'}</div>
        </div>
        <div className="menu__stat_item">
          <div>Counters</div>
          <div>{stats.counters}</div>
        </div>
      </div>
      <div className="menu__stats">
        <div className="menu__stat_item">
          <div>Users</div>
          <div>{stats.users}</div>
        </div>
        <div className="menu__stat_item">
          <div>Requests</div>
          <div>{stats.requests}</div>
        </div>
      </div>
      <div className="menu__btn" onClick={handleModeCounters}>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256" fill="#fff">
          <path d="M33.6,33.6h188.8c13,0,23.6,10.6,23.6,23.6v141.6c0,13-10.6,23.6-23.6,23.6H33.6c-13,0-23.6-10.6-23.6-23.6 V57.2C10,44.2,20.6,33.6,33.6,33.6L33.6,33.6 M33.6,57.2v141.6h82.6V57.2H33.6 M222.4,198.8V57.2h-14.6c2.8,6.4,2.2,12.6,2.2,13.3 c-0.8,7.9-6.4,16.2-8.4,19.1l-27.5,30.1l39.2-0.2l0.1,14.4l-61.4-0.4l-0.5-11.8c0,0,36-38.1,37.8-41.5c1.7-3.3,8.4-23-8.3-23 c-14.5,0.6-12.9,15.3-12.9,15.3l-18.2,0.1c0,0,0.1-7.8,4.5-15.5h-14.7v141.6h30.4l-0.1-10.1l11.4-0.1c0,0,10.7-1.9,10.9-12.4 c0.5-11.8-9.6-11.8-11.3-11.8c-1.5,0-12.6,0.6-12.6,10.3h-17.9c0,0,0.5-24.3,30.6-24.3c30.7,0,29,23.8,29,23.8s0.5,14.7-13.1,20.3 l6.1,4.4H222.4 M91.7,175.2H74v-68.4l-21.2,6.6V98.9l37.1-13.2h1.9V175.2z" />
        </svg>
        <div>Manage counters</div>
      </div>
      <div className="menu__btn" onClick={handleAnalytics}>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256" fill="#fff">
          <path d="M100,116.43a8,8,0,0,0,4-6.93v-72A8,8,0,0,0,93.34,30,104.06,104.06,0,0,0,25.73,147a8,8,0,0,0,4.52,5.81,7.86,7.86,0,0,0,3.35.74,8,8,0,0,0,4-1.07ZM88,49.62v55.26L40.12,132.51C40,131,40,129.48,40,128A88.12,88.12,0,0,1,88,49.62ZM128,24a8,8,0,0,0-8,8v91.82L41.19,169.73a8,8,0,0,0-2.87,11A104,104,0,1,0,128,24Zm0,192a88.47,88.47,0,0,1-71.49-36.68l75.52-44a8,8,0,0,0,4-6.92V40.36A88,88,0,0,1,128,216Z" />
        </svg>
        <div>Analytics</div>
      </div>
      <div className="menu__btn" onClick={handleModeUsers}>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256" fill="#fff">
          <path d="M168,56a8,8,0,0,1,8-8h16V32a8,8,0,0,1,16,0V48h16a8,8,0,0,1,0,16H208V80a8,8,0,0,1-16,0V64H176A8,8,0,0,1,168,56Zm62.56,54.68a103.92,103.92,0,1,1-85.24-85.24,8,8,0,0,1-2.64,15.78A88.07,88.07,0,0,0,40,128a87.62,87.62,0,0,0,22.24,58.41A79.66,79.66,0,0,1,98.3,157.66a48,48,0,1,1,59.4,0,79.66,79.66,0,0,1,36.06,28.75A87.62,87.62,0,0,0,216,128a88.85,88.85,0,0,0-1.22-14.68,8,8,0,1,1,15.78-2.64ZM128,152a32,32,0,1,0-32-32A32,32,0,0,0,128,152Zm0,64a87.57,87.57,0,0,0,53.92-18.5,64,64,0,0,0-107.84,0A87.57,87.57,0,0,0,128,216Z" />
        </svg>
        <div>Manage users</div>
      </div>
      <div className="menu__btn" onClick={handleLogout}>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
          <g stroke-width="1.5" fill="none" stroke="#fff">
            <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
            <path d="M9 12h12l-3 -3" />
            <path d="M18 15l3 -3" />
          </g>
        </svg>
        <div>{user!.name}</div>
        <div className="menu__btn_add">{stats.ip}</div>
      </div>
    </div>
  )
}
