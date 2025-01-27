import { React } from '../../utils/deps.ts'

export type TButtonProps = {
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
}

export function ButtonDel({ loading, disabled, onClick }: TButtonProps) {
  return (
    <button className="button_square" type="button" disabled={disabled || loading} onClick={onClick}>
      {loading ? (
        <div className="button__loader" />
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <g stroke-width="1.5" stroke="var(--color100)" fill="none">
            <path d="M4 7l16 0" />
            <path d="M10 11l0 6" />
            <path d="M14 11l0 6" />
            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
          </g>
        </svg>
      )}
    </button>
  )
}
