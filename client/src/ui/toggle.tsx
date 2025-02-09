import { React } from '../../utils/deps.ts'

type TToggleProps = {
  name?: string
  options: { id: number; label: string | JSX.Element }[]
  defChecked?: number
  reset?: boolean
  onChange?: (id: number | undefined) => void
}

const EXPERIMENTAL = true
let counter = 1

const Toggle = ({ name = `toggle${counter}`, options, defChecked, reset, onChange }: TToggleProps) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<(HTMLInputElement | null)[]>([])
  counter += 1

  React.useEffect(() => {
    if (defChecked !== undefined) {
      const el = inputRef.current[defChecked]
      if (el) {
        el.checked = true
        const parent = el.parentElement
        if (EXPERIMENTAL && ref.current && parent) {
          const { left, right } = ref.current.getBoundingClientRect()
          const { left: l, right: r } = parent.getBoundingClientRect()
          ref.current.setAttribute('style', `--l:${l - left - 1}px;--r:${right - r - 1}px;`)
        }
      }
    } else {
      inputRef.current.forEach(el => {
        if (el) el.checked = false
      })
      if (EXPERIMENTAL && ref.current) {
        ref.current.setAttribute('style', `--l:0;--r:0;`)
      }
    }
  }, [reset])

  const handleChange = (id: number) => {
    if (EXPERIMENTAL && ref.current) {
      const el = inputRef.current[id]
      if (el) {
        const parent = el.parentElement
        if (parent) {
          const { left, right } = ref.current.getBoundingClientRect()
          const { left: l, right: r } = parent.getBoundingClientRect()
          ref.current.setAttribute('style', `--l:${l - left - 1}px;--r:${right - r - 1}px;`)
        }
      }
    }
    if (onChange) onChange(id)
  }

  return (
    <div ref={ref} className="toggle">
      {options.map(item => (
        <label key={item.id} className={EXPERIMENTAL ? 'toggle__label_experimental' : 'toggle__label'}>
          <input
            ref={el => {
              inputRef.current[item.id] = el
            }}
            type="radio"
            name={name}
            onChange={() => handleChange(item.id)}
          />
          {item.label}
        </label>
      ))}
      {EXPERIMENTAL && <div className="toggle__mark" />}
    </div>
  )
}

export default Toggle
