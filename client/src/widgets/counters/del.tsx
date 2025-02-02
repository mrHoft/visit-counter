import { React } from '../../../utils/deps.ts'
import { ButtonSubmit, ButtonSecondary } from '../../ui/button.tsx'
import Modal from '../modal.tsx'
import { counterApi } from '../../api/counter.ts'
import type { TCounter } from '../../api/types.ts'
import Message from '../../widgets/message.tsx'

export default function CounterDelete({ counter, onSuccess }: { counter: TCounter; onSuccess?: () => void }) {
  const handleSubmit = () => {
    counterApi.del({ id: counter.id }).then(({ error }) => {
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
      <h3>Delete counter</h3>
      <div className="form">
        <p>
          Are you sure you want to delete counter <span style={{ color: 'red' }}>{counter.name}</span>?
        </p>
        <div className="flex_wrap" style={{ marginTop: '1rem' }}>
          <ButtonSubmit onClick={handleSubmit}>Delete</ButtonSubmit>
          <ButtonSecondary onClick={() => Modal.close()}>Close</ButtonSecondary>
        </div>
      </div>
    </>
  )
}
