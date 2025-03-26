import { React } from '../../utils/deps.ts'

const defPattern =
  '^(?=.*[admin])(?=.*\\d)(?=.*[a-z\\p{Ll}])(?=.*[A-Z\\p{Lu}])(?=.*[_@#$!%&=\\^\\*\\-\\+\\?\\~\\(\\)\\{\\}\\|])(?=.*[a-zA-Z\\p{L}\\d_@#$!%&=\\^\\*\\-\\+\\?\\~\\(\\)\\{\\}\\|]).{5,}$'
const passwordValidity = (value: string) => {
  let matches = 0
  if (value.match(/[0-9]/)) matches += 1
  if (value.match(/[A-Z\\p{Lu}]/)) matches += 1
  if (value.match(/[a-z\\p{Ll}]/)) matches += 1
  if (value.match(/[\\-_#$%@&!=\\.\\?\\^\\*\\+\\{\\|\\}\\~]/)) matches += 1
  if (value.length > 4) matches += 1
  return matches
}

export function InputPassword({
  name,
  placeholder,
  pattern = defPattern,
}: {
  name: string
  placeholder: string
  pattern?: string
}) {
  const [showPassword, setShowPassword] = React.useState(false)
  const strength = React.useRef<HTMLDivElement>(null)

  const handleChange = () => {
    setShowPassword(!showPassword)
  }

  const handleInput = (event: React.FormEvent<HTMLInputElement>) => {
    if (strength.current) {
      const matches = passwordValidity(event.currentTarget.value)
      strength.current.setAttribute(
        'style',
        `width:${(100 / 5) * matches}%;background-color:${matches > 4 ? 'green' : 'red'};`,
      )
    }
  }

  return (
    <div>
      <div className="input_container">
        <input
          className="password"
          type={showPassword ? 'text' : 'password'}
          name={name}
          placeholder=" "
          pattern={pattern}
          onInput={handleInput}
          required
        />
        <div ref={strength} className="password__strength" />
        <label className="password__show" htmlFor={`show_${name}`}>
          <input type="checkbox" name={`show_${name}`} id={`show_${name}`} onChange={handleChange} />
        </label>
        <div className="input__placeholder">{placeholder}</div>
        <div className="password__valid">&#x2714;</div>
      </div>
    </div>
  )
}
