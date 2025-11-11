import { React } from '../../utils/deps.ts'
import { type TUser } from '../api/types.ts'
import storeUser from '../entities/user.ts'
import storeStats, { type TStats } from '../entities/stats.ts'
import { CounterIcon, AnalyticsIcon, UsersIcon, LoginIcon, LogoutIcon, InfoIcon, InstallDesktopIcon, InstallAndroidIcon } from '../ui/icon.tsx'
import { InstallManager } from '../../utils/installManager.ts'
import Message from './message.tsx'

export type TMode = 'login' | 'menu' | 'counters' | 'users' | 'analytics' | 'about'

type TMenuProps = { user: TUser; server?: boolean; modeChange: (mode: TMode) => void }
const defaultStats = { counters: 0, users: 0, requests: 0, host: '', ip: '', version: '' }

export default function MainMenu({ user, server, modeChange }: TMenuProps) {
  const [isClient, setIsClient] = server ? [false, () => { }] : React.useState(false)
  const [stats, setStats] = server ? [defaultStats, () => { }] : React.useState<TStats>(defaultStats)
  const [canBeInstalled, setCanBeInstalled] = server ? [false, () => { }] : React.useState(false)
  const [deviceType, setDeviceType] = server ? ['unknown', () => { }] : React.useState('unknown')
  const installManager = server ? { current: null } : React.useRef<InstallManager | null>(null)
  const authorized = Boolean(user)

  if (!server) {
    React.useEffect(() => {
      setIsClient(true)
      setStats(storeStats.stats)
      storeStats.on('update', () => {
        setStats(storeStats.stats)
      })

      if (!installManager.current) {
        installManager.current = new InstallManager()
        installManager.current.registerCallbacks({
          onReadyToInstall: (ready: boolean) => {
            setCanBeInstalled(ready)
          }
        })
      }
      setCanBeInstalled(installManager.current.installAvailable())
      setDeviceType(installManager.current.getDeviceType())
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

  const handleInstall = () => {
    if (installManager.current) {
      installManager.current.installPWA().then(result => {
        setCanBeInstalled(!result.done)
        if (result.error) {
          Message.show(result.error, 'error')
        }
      })
    }
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
      {canBeInstalled && (
        <div className="menu__btn" onClick={handleInstall}>
          {deviceType === 'android' ? <InstallAndroidIcon /> : <InstallDesktopIcon />}
          <div>Install</div>
        </div>
      )}
    </div>
  )
}
