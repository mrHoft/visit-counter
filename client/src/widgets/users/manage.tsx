import { React } from '../../../utils/deps.ts'
import { ButtonSubmit, ButtonSecondary } from '../../ui/button.tsx'
import Input from '../../ui/input.tsx'
import { InputPassword } from '../../ui/password.tsx'
import Select from '../../ui/select.tsx'
import Modal from '../modal.tsx'
import { userApi } from '../../api/user.ts'
import { type TUser, type TUserRole } from '../../api/types.ts'
import Message from '../message.tsx'
import { PATTERN } from '../const.ts'
import { isFormElement } from '../../utils/element.ts'

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

    const api = editMode ? userApi.edit : userApi.add
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
      if (isFormElement<HTMLInputElement | HTMLSelectElement>(el)) {
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
          pattern={PATTERN.name}
          minLength={3}
          maxLength={24}
          required
        />
        <InputPassword name="password" placeholder={`password${editMode ? '' : '*'}`} />
        <Input type="text" name="email" placeholder="email" pattern={PATTERN.email} minLength={6} maxLength={24} />
        <Select name="role" options={roles} placeholder="role*" defaultValue={user?.role ?? 'guest'} required />
        <div className="flex_wrap" style={{ marginTop: '1rem' }}>
          <ButtonSubmit>Save</ButtonSubmit>
          <ButtonSecondary onClick={() => Modal.close()}>Close</ButtonSecondary>
        </div>
      </form>
    </>
  )
}
