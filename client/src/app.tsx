import { React } from '../utils/deps.ts' // Relative path for deno bundler
import Input from './ui/input.tsx'
import { ButtonSubmit } from './ui/button.tsx'
import { login } from './api/login.ts'

export default function App({ server }: { server?: boolean }) {
  const [isClient, setIsClient] = server ? [false, () => {}] : React.useState(false)
  const [error, setError] = server ? [null, () => {}] : React.useState<string | null>(null)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const el = event.currentTarget
    const formData = new FormData(el)
    const data = { name: formData.get('name')!.toString(), password: formData.get('password')!.toString() }
    console.log(data)
    login(data).then(({ user, error }) => {
      console.log(user, error)
      if (error) setError(error)
      else setError(null)
    })
  }

  if (!server) {
    React.useEffect(() => {
      setIsClient(true)
    }, [])
  }

  return (
    <div className="page">
      <div className="flex_wrap">
        <h1>Counter</h1>
        <div>admin panel</div>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <div>Please login:</div>
        <Input
          type="text"
          name="name"
          placeholder="name"
          pattern="^[a-zA-Z0-9]+$"
          minLength={3}
          required
          defaultValue={'admin'}
        />
        <Input
          type="password"
          name="password"
          placeholder="password"
          pattern="^[0-9A-Za-z\\-_#$@&!]+$"
          minLength={5}
          required
          defaultValue={'admin'}
        />
        <p style={{ color: 'red', height: '1lh', margin: 0 }}>{error}</p>
        <ButtonSubmit>Submit</ButtonSubmit>
      </form>
      <div>
        Hydration status: <span style={{ color: isClient ? 'green' : 'red' }}>{isClient ? 'online' : 'offline'}</span>
      </div>
      <div className="copyright">
        <span>&copy; 2025 </span>
        <a href="https://github.com/mrHoft/visit-counter" target="_blank">
          mrHoft
        </a>
      </div>
    </div>
  )
}
