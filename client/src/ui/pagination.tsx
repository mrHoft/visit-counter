import { React } from '../../utils/deps.ts'

type TPaginationProps = { page: number; total: number; pageSize?: number; onChange: (page: number) => void }

export default function Pagination({ page, total, pageSize = 10, onChange }: TPaginationProps) {
  const len = Math.ceil(total / pageSize)
  const first = (() => {
    if (page < 3 || len <= 5) return 0
    if (page + 2 >= len) return len - 5
    return page - 2
  })()
  const btns = Array.from({ length: Math.min(len, 5) }, (_, i) => {
    const n = first + i
    return (
      <button className="pagination__btn" key={n} onClick={() => onChange(n)} disabled={page === n}>
        {n + 1}
      </button>
    )
  })

  const leftClickHandler = () => {
    if (page > 0) onChange(page - 1)
  }

  const rightClickHandler = () => {
    if (page < len - 1) onChange(page + 1)
  }

  if (total <= pageSize) return null

  return (
    <div className="pagination">
      <button className="pagination__slide" onClick={leftClickHandler} disabled={page === 0}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10.828 12L15.778 16.95L14.364 18.364L8 12L14.364 5.63599L15.778 7.04999L10.828 12Z" />
        </svg>
      </button>
      {page >= 3 && len > 5 && (
        <>
          <button className="pagination__btn" onClick={() => onChange(0)} disabled={page === 0}>
            1
          </button>
          {first > 1 && <span>•••</span>}
        </>
      )}
      {btns}
      {page + 3 < len && len > 5 && (
        <>
          {first + 6 < len && <span>•••</span>}
          <button className="pagination__btn" onClick={() => onChange(len - 1)} disabled={page === len - 1}>
            {len}
          </button>
        </>
      )}
      <button className="pagination__slide" onClick={rightClickHandler} disabled={page === len - 1}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.1722 12L8.22217 7.04999L9.63617 5.63599L16.0002 12L9.63617 18.364L8.22217 16.95L13.1722 12Z" />
        </svg>
      </button>
    </div>
  )
}
