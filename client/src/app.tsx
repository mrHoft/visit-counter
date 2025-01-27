import { React } from '../utils/deps.ts' // Relative path for deno bundler
import LoginForm from './widgets/loginForm.tsx'
import Footer from './widgets/footer.tsx'
import Header from './widgets/header.tsx'
import { TUser } from './api/types.ts'
import LogoutButton from './widgets/logout.tsx'
import storeUser from './entities/user.ts'

export default function App({ server, initialUser }: { server?: boolean; initialUser?: TUser }) {
  const [user, setUser] = server ? [initialUser, () => {}] : React.useState<TUser | undefined>(initialUser)

  if (!server) {
    React.useEffect(() => {
      storeUser.on('update', () => {
        setUser(storeUser.user)
      })
    }, [])
  }

  return (
    <>
      <Header />
      <main className="page">
        {!user && <LoginForm server={server} />}
        {user !== undefined && (
          <>
            <p>{`Logged in as: ${user.name}`}</p>
            <LogoutButton />
          </>
        )}
      </main>
      <Footer server={server} />
    </>
  )
}
