import { React } from '../../utils/deps.ts'

export type TInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onBlur'> & {
  type?: string
  name: string
  placeholder: string
  defaultValue?: string | number
  required?: boolean
  disabled?: boolean
  minLength?: number
  pattern?: string
  title?: string
  readonly?: boolean
  children?: React.ReactNode
  onChange?: (value: string) => void
  onBlur?: (value: string) => void
}

const Input = React.forwardRef<HTMLInputElement, TInputProps>(
  (
    {
      type,
      name,
      placeholder,
      defaultValue,
      required,
      disabled,
      minLength,
      pattern,
      title,
      readonly,
      children,
      onChange,
      onBlur,
      hidden,
    },
    ref,
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (type === 'number' && Number(e.target.value) < 0) {
        return
      }

      if (onChange) onChange(e.target.value)
    }

    return (
      <div className={hidden ? 'input_container hidden' : 'input_container'} onClick={e => e.stopPropagation()}>
        <input
          ref={ref}
          type={type}
          className="input"
          name={name}
          id={`form_${name}`}
          placeholder=" "
          minLength={minLength}
          autoComplete="false"
          defaultValue={defaultValue}
          required={required ?? false}
          disabled={disabled}
          pattern={pattern}
          title={title}
          readOnly={readonly}
          onChange={handleChange}
          onBlur={e => {
            if (onBlur) onBlur(e.target.value)
          }}
          hidden={hidden}
        />
        <label className="input__placeholder" htmlFor={`form_${name}`}>
          {placeholder}
        </label>
        {pattern && <span className="input__valid">&#x2714;</span>}
        {children}
      </div>
    )
  },
)

export default Input
