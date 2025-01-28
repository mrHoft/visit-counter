import { React } from '../utils/deps.ts' // Relative path for deno bundler
import LoginForm from './widgets/loginForm.tsx'
import Footer from './widgets/footer.tsx'
import Header from './widgets/header.tsx'
import type { TUser } from './api/types.ts'
import storeUser from './entities/user.ts'
import MainMenu, { type TMode } from './widgets/menu.tsx'
import ManageCounters from './widgets/counters/counters.tsx'
import ManageUsers from './widgets/users.tsx'
import Analytics from './widgets/analytics.tsx'
import Modal from './widgets/modal.tsx'

export default function App({ server, initialUser }: { server?: boolean; initialUser?: TUser }) {
  const [user, setUser] = server ? [initialUser, () => {}] : React.useState<TUser | undefined>(initialUser)
  const [mode, setMode] = server
    ? [initialUser ? 'menu' : 'login', () => {}]
    : React.useState<TMode>(initialUser ? 'menu' : 'login')

  if (!server) {
    React.useEffect(() => {
      storeUser.on('update', () => {
        setUser(storeUser.user)
        setMode(storeUser.user ? 'menu' : 'login')
      })
    }, [])
  }

  return (
    <>
      <Header />
      <main className="page">
        {mode === 'login' && <LoginForm server={server} />}
        {mode === 'menu' && <MainMenu user={user!} server={server} modeChange={setMode} />}
        {mode === 'counters' && <ManageCounters modeChange={setMode} />}
        {mode === 'users' && <ManageUsers modeChange={setMode} />}
        {mode === 'analytics' && <Analytics modeChange={setMode} />}
      </main>
      <Footer />
      <Modal />
    </>
  )
}
