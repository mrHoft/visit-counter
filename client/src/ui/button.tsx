import { React } from '../../utils/deps.ts'

export type TButtonProps = {
  children: string | JSX.Element
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
}

export function ButtonSubmit({ children, loading, disabled, onClick }: TButtonProps) {
  return (
    <button className="button primary" type="submit" disabled={disabled || loading} onClick={onClick}>
      {loading ? <div className="button__loader" /> : children}
    </button>
  )
}

export function ButtonSecondary({ children, loading, disabled, onClick }: TButtonProps) {
  return (
    <button className="button secondary" type="button" disabled={disabled || loading} onClick={onClick}>
      {loading ? <div className="button__loader" /> : children}
    </button>
  )
}
