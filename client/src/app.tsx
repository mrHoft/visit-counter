import { React } from '../utils/deps.ts' // Relative path for deno bundler
import LoginForm from './widgets/loginForm.tsx'
import Footer from './widgets/footer.tsx'
import Header from './widgets/header.tsx'
import type { TUser } from './api/types.ts'
import storeUser from './entities/user.ts'
import MainMenu, { type TMode } from './widgets/menu.tsx'
import ManageCounters from './widgets/counters/counters.tsx'
import ManageUsers from './widgets/users/users.tsx'
import PageAnalytics from './widgets/analytics/page.tsx'
import About from './widgets/about.tsx'
import Modal from './widgets/modal.tsx'
import Message from './widgets/message.tsx'

export default function App({ server, initialUser }: { server?: boolean; initialUser?: TUser }) {
  const [user, setUser] = server ? [initialUser, () => {}] : React.useState<TUser | undefined>(initialUser)
  const [mode, setMode] = server ? ['menu', () => {}] : React.useState<TMode>('menu')

  if (!server) {
    React.useEffect(() => storeUser.on('update', () => setUser(storeUser.user)), [])
  }

  return (
    <>
      <Header authorized={Boolean(user)} />
      <main className="page">
        {mode === 'login' && <LoginForm server={server} modeChange={setMode} />}
        {mode === 'menu' && <MainMenu user={user!} server={server} modeChange={setMode} />}
        {mode === 'counters' && <ManageCounters modeChange={setMode} />}
        {mode === 'users' && <ManageUsers modeChange={setMode} />}
        {mode === 'analytics' && <PageAnalytics modeChange={setMode} />}
        {mode === 'about' && <About modeChange={setMode} />}
      </main>
      <Footer server={server} />
      <Modal />
      <Message />
    </>
  )
}
