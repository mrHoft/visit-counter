import { React } from '../utils/deps.ts' // Relative path for deno bundler
import LoginForm from './widgets/loginForm.tsx'
import Footer from './widgets/footer.tsx'
import Header from './widgets/header.tsx'
import type { TUser } from './api/types.ts'
import storeUser from './entities/user.ts'
import MainMenu, { type TMode } from './widgets/menu.tsx'
import { ButtonSecondary } from './ui/button.tsx'

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
        {mode === 'menu' && <MainMenu user={user!} modeChange={setMode} />}
        {mode === 'counters' && (
          <>
            <h2>Manage counters</h2>
            <p>Not implemented.</p>
            <ButtonSecondary onClick={() => setMode('menu')}>Back</ButtonSecondary>
          </>
        )}
        {mode === 'users' && (
          <>
            <h2>Manage users</h2>
            <p>Not implemented.</p>
            <ButtonSecondary onClick={() => setMode('menu')}>Back</ButtonSecondary>
          </>
        )}
      </main>
      <Footer server={server} />
    </>
  )
}
