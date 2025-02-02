import { React } from '../../../utils/deps.ts'
import { ButtonSubmit, ButtonSecondary } from '../../ui/button.tsx'
import Input from '../../ui/input.tsx'
import Select from '../../ui/select.tsx'
import Modal from '../modal.tsx'
import { addUser } from '../../api/addUser.ts'
import { editUser } from '../../api/editUser.ts'
import { type TUser, type TUserRole } from '../../api/types.ts'
import Message from '../message.tsx'

export const isElement = <T extends HTMLElement>(el: Element): el is T => {
  const prototype = Object.getPrototypeOf(el)
  return Object.prototype.hasOwnProperty.call(prototype, 'name')
}

const roles: TUserRole[] = ['admin', 'user', 'guest']
type TUserManageProps = { user?: TUser; onSuccess?: () => void }

export default function UserManage({ user, onSuccess }: TUserManageProps) {
  const editMode = Boolean(user)
  const ref = React.useRef<HTMLFormElement>(null)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const el = event.currentTarget
    const formData = new FormData(el)
    const password = formData.get('password')
    const data = {
      id: user?.id,
      name: formData.get('name')!.toString(),
      password: password ? password.toString() : undefined,
      email: formData.get('email')!.toString(),
      role: formData.get('role') as TUserRole,
    }

    const api = editMode ? editUser : addUser
    api(data).then(({ error }) => {
      if (error) {
        Message.show(error, 'error')
        return
      }
      Modal.close()
      if (onSuccess) onSuccess()
    })
  }

  React.useEffect(() => {
    const form = ref.current
    if (!form) return
    const elements = form.elements as HTMLFormControlsCollection
    for (const el of elements) {
      if (isElement<HTMLInputElement | HTMLSelectElement>(el)) {
        switch (el.name) {
          case 'name': {
            if (user?.name) el.value = user.name
            else el.value = ''
            break
          }
          case 'email': {
            if (user?.email) el.value = user.email
            else el.value = ''
            break
          }
          case 'role': {
            if (user?.role) el.value = user.role
            else el.value = roles[2]
            break
          }
          default: {
            el.value = ''
          }
        }
      }
    }
  }, [user])

  return (
    <>
      <h3>{`${editMode ? 'Edit' : 'Add'} user`}</h3>
      <form ref={ref} className="form" onSubmit={handleSubmit}>
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
          placeholder={`password${editMode ? '' : '*'}`}
          pattern="^[0-9A-Za-z\-_#$%@&!=\.\?\^\*\+\{\|\}\~]+$"
          minLength={5}
          maxLength={16}
          required={!editMode}
        />
        <Input
          type="text"
          name="email"
          placeholder="email"
          pattern="[a-zA-Z0-9!#$%&'\*\+=\?\^_\{\|\}\~\-]+(?:\.[a-zA-Z0-9!#$%&'\*\+=\?\^_\{\|\}\~\-]+)*@(?:[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?"
          minLength={6}
          maxLength={24}
        />
        <Select name="role" options={roles} placeholder="role*" defaultValue={user?.role ?? 'guest'} required />
        <div className="flex_wrap" style={{ marginTop: '1rem' }}>
          <ButtonSubmit>Save</ButtonSubmit>
          <ButtonSecondary onClick={() => Modal.close()}>Close</ButtonSecondary>
        </div>
      </form>
    </>
  )
}
