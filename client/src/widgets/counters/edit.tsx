import { React } from '../../../utils/deps.ts'
import { ButtonSubmit, ButtonSecondary } from '../../ui/button.tsx'
import Input from '../../ui/input.tsx'
import Modal from '../modal.tsx'
import { counterApi } from '../../api/counter.ts'
import type { TCounter } from '../../api/types.ts'
import Message from '../../widgets/message.tsx'

export default function CounterEdit({ counter, onSuccess }: { counter: TCounter; onSuccess?: () => void }) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const el = event.currentTarget
    const formData = new FormData(el)
    const data = { id: counter.id, name: formData.get('name')!.toString(), value: formData.get('value')!.toString() }

    counterApi.edit(data).then(({ error }) => {
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
      <h3>Edit counter</h3>
      <form className="form" onSubmit={handleSubmit}>
        <Input
          type="text"
          name="name"
          placeholder="name"
          pattern="^[a-zA-Z0-9]+$"
          minLength={3}
          maxLength={24}
          required
          defaultValue={counter.name}
        />
        <Input
          type="text"
          name="value"
          placeholder="starter value"
          pattern="^[0-9]+$"
          maxLength={5}
          required
          defaultValue={counter.value}
        />
        <div className="flex_wrap" style={{ marginTop: '1rem' }}>
          <ButtonSubmit>Save</ButtonSubmit>
          <ButtonSecondary onClick={() => Modal.close()}>Close</ButtonSecondary>
        </div>
      </form>
    </>
  )
}
