import { React } from '../../utils/deps.ts'

export type TButtonProps = {
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
}

export function ButtonEdit({ loading, disabled, onClick }: TButtonProps) {
  return (
    <button className="button_square" type="button" disabled={disabled || loading} onClick={onClick}>
      {loading ? (
        <div className="button__loader" />
      ) : (
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <g stroke-width="1.5" stroke="var(--color100)" fill="none">
            <path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" />
            <polygon points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" />
          </g>
        </svg>
      )}
    </button>
  )
}
