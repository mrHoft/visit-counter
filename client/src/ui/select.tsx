import { React } from '../../utils/deps.ts'

export type TSelectProps = {
  options: string[]
  name: string
  placeholder: string
  defaultValue?: string | number
  value?: string | number
  required?: boolean
  disabled?: boolean
  minLength?: number
  pattern?: string
  title?: string
  readonly?: boolean
  onChange?: (value: string) => void
  onBlur?: (value: string) => void
}

const Select = React.forwardRef<HTMLSelectElement, TSelectProps>(
  ({ options, name, placeholder, defaultValue, value, required, disabled, title, onChange, onBlur }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (onChange) onChange(e.target.value)
    }

    return (
      <div className={'input_container'} onClick={e => e.stopPropagation()}>
        <select
          ref={ref}
          className="select"
          name={name}
          defaultValue={defaultValue}
          value={value}
          required={required ?? false}
          disabled={disabled}
          title={title}
          onChange={handleChange}
          onBlur={e => {
            if (onBlur) onBlur(e.target.value)
          }}
        >
          {options.map((role, i) => (
            <option key={i}>{role}</option>
          ))}
        </select>
        <div className="select__placeholder">{placeholder}</div>
      </div>
    )
  },
)

export default Select
