import { React } from '../../../utils/deps.ts'
import { ButtonSubmit, ButtonSecondary } from '../../ui/button.tsx'
import Input from '../../ui/input.tsx'
import Modal from '../modal.tsx'
import { counterApi } from '../../api/counter.ts'
import Message from '../message.tsx'
import type { TCounter } from '../../api/types.ts'
import { PATTERN } from '../const.ts'
import { isFormElement } from '../../utils/element.ts'

export default function CounterManage({ counter, onSuccess }: { counter?: TCounter; onSuccess?: () => void }) {
  const editMode = Boolean(counter)
  const ref = React.useRef<HTMLFormElement>(null)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const el = event.currentTarget
    const formData = new FormData(el)
    const data = {
      id: counter?.id,
      name: formData.get('counter-name')!.toString(),
      value: formData.get('counter-value')!.toString(),
    }

    const api = editMode ? counterApi.edit : counterApi.add
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
          case 'counter-name': {
            if (counter?.name) el.value = counter.name
            else el.value = ''
            break
          }
          case 'counter-value': {
            if (counter?.value !== undefined) el.value = counter.value.toString()
            else el.value = '0'
            break
          }
          default: {
            el.value = ''
          }
        }
      }
    }
  }, [counter])

  return (
    <>
      <h3>{`${editMode ? 'Edit' : 'Add'} counter`}</h3>
      <form ref={ref} className="form" onSubmit={handleSubmit}>
        <Input
          type="text"
          name="counter-name"
          placeholder="name"
          pattern={PATTERN.name}
          minLength={3}
          maxLength={24}
          required
        />
        <Input
          type="text"
          name="counter-value"
          placeholder="starter value"
          pattern={PATTERN.number}
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
