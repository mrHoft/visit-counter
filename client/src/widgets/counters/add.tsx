import { React } from '../../../utils/deps.ts'
import { ButtonSubmit, ButtonSecondary } from '../../ui/button.tsx'
import Input from '../../ui/input.tsx'
import Modal from '../modal.tsx'
import { counterApi } from '../../api/counter.ts'
import Message from '../../widgets/message.tsx'

export default function CounterAdd({ onSuccess }: { onSuccess?: () => void }) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const el = event.currentTarget
    const formData = new FormData(el)
    const data = { name: formData.get('name')!.toString(), value: formData.get('value')!.toString() }

    counterApi.add(data).then(({ error }) => {
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
      <h3>Add counter</h3>
      <form className="form" onSubmit={handleSubmit}>
        <Input
          type="text"
          name="name"
          placeholder="name"
          pattern="^[a-zA-Z0-9]+$"
          minLength={3}
          maxLength={24}
          required
        />
        <Input
          type="text"
          name="value"
          placeholder="starter value"
          pattern="^[0-9]+$"
          maxLength={5}
          required
          defaultValue="0"
        />
        <div className="flex_wrap" style={{ marginTop: '1rem' }}>
          <ButtonSubmit>Save</ButtonSubmit>
          <ButtonSecondary onClick={() => Modal.close()}>Close</ButtonSecondary>
        </div>
      </form>
    </>
  )
}
