import { React } from '../../utils/deps.ts' // Relative path for deno bundler
import Input from '../ui/input.tsx'
import { InputPassword } from '../ui/password.tsx'
import { ButtonSubmit } from '../ui/button.tsx'
import { login } from '../api/login.ts'
import storeUser from '../entities/user.ts'
import { type TMode } from './menu.tsx'

type TLoginFormProps = { server?: boolean; modeChange: (mode: TMode) => void }

export default function LoginForm({ server, modeChange }: TLoginFormProps) {
  const [error, setError] = server ? [null, () => {}] : React.useState<string | null>(null)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const el = event.currentTarget
    const formData = new FormData(el)
    const data = { name: formData.get('name')!.toString(), password: formData.get('password')!.toString() }

    login(data).then(({ data, error }) => {
      if (error) setError(error)
      else {
        setError(null)
        storeUser.user = { ...data! }
        modeChange('menu')
      }
    })
  }

  return (
    <form className="form login" onSubmit={handleSubmit}>
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
      <InputPassword name="password" placeholder="password" pattern="^[0-9A-Za-z\\-_#$@&!]+$" />
      <p style={{ color: 'red', height: '1lh', margin: 0 }}>{error}</p>
      <ButtonSubmit>Submit</ButtonSubmit>
    </form>
  )
}
