import { React } from '../../../utils/deps.ts'
import Intersection from '../../entities/intersection.ts'

const colors = ['#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff5722']
const size = 100
const R = 33
const strokeWidth = (size / 2 - R) * 2
const L = Math.PI * 2 * R

export const PieChart = ({ data, total }: { data: Record<string, number>; total: number }) => {
  const [update, setUpdate] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  const sections = React.useMemo(() => {
    let offset = 0
    const arr = Object.keys(data)
      .slice(0, 8)
      .map((key, id) => {
        const length = (data[key] / total) * L
        const color = colors[id]
        const section = { id, label: key, length, color, offset }
        offset -= length
        return section
      })
    return arr
  }, [data, total])

  React.useEffect(() => {
    const observer = (() => (ref.current ? new Intersection(ref.current, setUpdate) : null))()

    return () => {
      if (observer) observer.disconnect()
    }
  }, [])

  return (
    <div ref={ref} style={{ display: 'flex', gap: '2rem' }} aria-label="piechart">
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox={`0 0 ${size} ${size}`} fill="none">
        <circle r={R} cx={size / 2} cy={size / 2} strokeWidth={strokeWidth} stroke="#333" />
        {sections.map(item => (
          <circle
            key={item.id}
            r={R}
            cx={size / 2}
            cy={size / 2}
            stroke={item.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${update ? item.length : 0} ${L}`}
            strokeDashoffset={update ? item.offset : 0}
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: 'center',
              transition: 'stroke-dasharray 2s, stroke-dashoffset 2s',
            }}
          />
        ))}
      </svg>
      <div style={{ alignSelf: 'center' }}>
        {sections.map(item => (
          <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ backgroundColor: item.color, width: '1rem', height: '1rem' }} />
            <div>{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
