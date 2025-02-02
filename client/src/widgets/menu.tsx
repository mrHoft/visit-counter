import { React } from '../../utils/deps.ts'
import { type TUser } from '../api/types.ts'
import storeUser from '../entities/user.ts'
import storeStats, { type TStats } from '../entities/stats.ts'
import { CounterIcon, AnalyticsIcon, UsersIcon, LoginIcon, LogoutIcon, InfoIcon } from '../ui/icon.tsx'

export type TMode = 'login' | 'menu' | 'counters' | 'users' | 'analytics' | 'about'

type TMunuProps = { user: TUser; server?: boolean; modeChange: (mode: TMode) => void }
const defaultStats = { counters: 0, users: 0, requests: 0, host: '', ip: '', version: '' }

export default function MainMenu({ user, server, modeChange }: TMunuProps) {
  const [isClient, setIsClient] = server ? [false, () => {}] : React.useState(false)
  const [stats, setStats] = server ? [defaultStats, () => {}] : React.useState<TStats>(defaultStats)
  const authorized = Boolean(user)

  if (!server) {
    React.useEffect(() => {
      setIsClient(true)
      setStats(storeStats.stats)
      storeStats.on('update', () => {
        setStats(storeStats.stats)
      })
    }, [])
  }

  const handleLogin = () => {
    modeChange('login')
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

  const handleAbout = () => {
    modeChange('about')
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
      {authorized && (
        <>
          <div className="menu__btn" onClick={handleModeCounters}>
            <CounterIcon />
            <div>Manage counters</div>
          </div>
          <div className="menu__btn" onClick={handleModeUsers}>
            <UsersIcon />
            <div>Manage users</div>
          </div>
        </>
      )}
      <div className="menu__btn" onClick={handleAnalytics}>
        <AnalyticsIcon />
        <div>Analytics</div>
      </div>
      {authorized && (
        <div className="menu__btn" onClick={handleLogout}>
          <LogoutIcon />
          <div>{user!.name}</div>
          <div className="menu__btn_add">{stats.ip}</div>
        </div>
      )}
      {!authorized && (
        <>
          <div className="menu__btn" onClick={handleAbout}>
            <InfoIcon />
            <div>About</div>
          </div>
          <div className="menu__btn" onClick={handleLogin}>
            <LoginIcon />
            <div>Login</div>
            <div className="menu__btn_add">{stats.ip}</div>
          </div>
        </>
      )}
    </div>
  )
}
