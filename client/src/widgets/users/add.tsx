import { React } from '../../../utils/deps.ts'
import { ButtonSubmit, ButtonSecondary } from '../../ui/button.tsx'
import Input from '../../ui/input.tsx'
import Select from '../../ui/select.tsx'
import Modal from '../modal.tsx'
import { addUser } from '../../api/addUser.ts'
import { type TUserRole } from '../../api/types.ts'
import Message from '../../widgets/message.tsx'

const roles: TUserRole[] = ['admin', 'user', 'guest']

export default function UserAdd({ onSuccess }: { onSuccess?: () => void }) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const el = event.currentTarget
    const formData = new FormData(el)
    const data = {
      name: formData.get('name')!.toString(),
      password: formData.get('password')!.toString(),
      email: formData.get('email')!.toString(),
      role: formData.get('role') as TUserRole,
    }
    console.log(data)

    addUser(data).then(({ error }) => {
      if (error) {
        Message.show(error, 'error')
        return
      }
      Modal.close()
      if (onSuccess) onSuccess()
    })
  }

  return (
    <>
      <h3>Add user</h3>
      <form className="form" onSubmit={handleSubmit}>
        <Input
          type="text"
          name="name"
          placeholder="name*"
          pattern="^[a-zA-Z0-9]+$"
          minLength={3}
          maxLength={24}
          required
        />
        <Input
          type="password"
          name="password"
          placeholder="password*"
          pattern="^[0-9A-Za-z\\-_#$@&!]+$"
          minLength={5}
          maxLength={16}
          required
          autoComplete="new-password"
        />
        <Input
          type="text"
          name="email"
          placeholder="email"
          pattern="^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$"
          minLength={6}
          maxLength={24}
        />
        <Select name="role" options={roles} placeholder="role*" required />
        <div className="flex_wrap" style={{ marginTop: '1rem' }}>
          <ButtonSubmit>Save</ButtonSubmit>
          <ButtonSecondary onClick={() => Modal.close()}>Close</ButtonSecondary>
        </div>
      </form>
    </>
  )
}
