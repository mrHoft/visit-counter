import { React } from '../../../utils/deps.ts'
import { ButtonSubmit, ButtonSecondary } from '../../ui/button.tsx'
import Modal from '../modal.tsx'
import { delUser } from '../../api/delUser.ts'
import type { TUser } from '../../api/types.ts'
import Message from '../../widgets/message.tsx'

export default function UserDelete({ user, onSuccess }: { user: TUser; onSuccess?: () => void }) {
  const handleSubmit = () => {
    delUser({ id: user.id }).then(({ error }) => {
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
      <h3>Delete user</h3>
      <div className="form">
        <p>
          Are you sure you want to delete user <span style={{ color: 'red' }}>{user.name}</span>?
        </p>
        <div className="flex_wrap" style={{ marginTop: '1rem' }}>
          <ButtonSubmit onClick={handleSubmit}>Delete</ButtonSubmit>
          <ButtonSecondary onClick={() => Modal.close()}>Close</ButtonSecondary>
        </div>
      </div>
    </>
  )
}
