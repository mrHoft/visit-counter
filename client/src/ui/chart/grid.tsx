import { React } from '../../../utils/deps.ts'

const width = 600
const height = 200
const gridLines = 7

export const GridChart = ({ data }: { data: Record<string, number> }) => {
  const [gridX, gridY, path1, path2] = React.useMemo(() => {
    const max = Math.max(...Object.values(data))
    const points = Object.keys(data)

    const gridXLength = Math.min(points.length, 10)
    const labelFactor = (points.length - 1) / (gridXLength - 1)
    const gridX = Array.from({ length: gridXLength }, (_, i) => ({
      x: Math.floor(((width - 16) / (gridXLength - 1 || 1)) * i) + 12,
      label: points[Math.ceil(labelFactor * i)] ?? points[0],
    }))

    const gridYStep = (height - 2) / (gridLines - 1)
    const gridY = Array.from({ length: gridLines }, (_, i) => ({
      y: Math.floor(i * gridYStep + 1),
      label: (max - (max / (gridLines - 1)) * i).toFixed(0),
    }))

    const dx = width / (points.length - 1 || 1)
    const dy = (height / max) * 0.75
    const arr = Object.keys(data).map((key, i) => {
      const x = dx * i
      const y = height - dy * data[key]
      return { x, y }
    })
    if (arr.length === 1) arr.push({ x: width, y: arr[0].y })

    const path1 = (() => {
      const d = arr.reduce((acc, curr) => {
        const [x, y] = [curr.x.toFixed(2), curr.y.toFixed(2)]
        return !acc.length ? `M${x},${y} S` : `${acc} ${x},${y}`
      }, '')
      if (arr.length % 2 === 0) {
        const last = arr[arr.length - 1]
        return `${d} ${last.x.toFixed(2)},${last.y.toFixed(2)}`
      }
      return d
    })()
    const path2 = `${path1} L${width},${height} L0,${height} Z`

    return [gridX, gridY, path1, path2]
  }, [data])

  return (
    <div aria-label="gridchart">
      <svg style={{ width: '100%' }} xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${width} ${height + 20}`}>
        <defs>
          <linearGradient id="gradient1" x1="0" y1="0" x2="0" y2="1">
            <stop stopOpacity="0.55" stopColor="rgba(26,86,219,0.55)" offset="0"></stop>
            <stop stopOpacity="0" stopColor="rgba(28,100,242,0)" offset="1"></stop>
            <stop stopOpacity="0" stopColor="rgba(28,100,242,0)" offset="1"></stop>
          </linearGradient>
          <linearGradient id="gradient2" x1="0" y1="0" x2="0" y2="1">
            <stop stopOpacity="0.55" stopColor="rgba(126,59,242,0.55)" offset="0"></stop>
            <stop stopOpacity="0" stopColor="rgba(126,59,242,0)" offset="1"></stop>
            <stop stopOpacity="0" stopColor="rgba(126,59,242,0)" offset="1"></stop>
          </linearGradient>
        </defs>
        <g stroke="#e0e0e0" strokeDasharray="4" strokeWidth={0.5} aria-label="grid">
          {gridY.map((item, i) => (
            <line key={i} x1="0" y1={item.y} x2={width} y2={item.y} />
          ))}
        </g>
        <g aria-label="graph">
          <path fill="url(#gradient1)" d={path2} />
          <path stroke="#1a56db" /* #7e3bf2 */ strokeWidth="4" fill="none" d={path1} />
        </g>
        <g fill="#e0e0e0" fontFamily='"Open Sans", sans-serif' aria-label="label">
          {gridY.map((item, i) => {
            return i > 0 && i !== gridY.length - 1 ? (
              <text key={i} x="0" y={item.y}>
                {item.label}
              </text>
            ) : null
          })}
          {gridX.map((item, i) => (
            <text key={i} x={item.x} y={height + 20} writingMode={'sideways-lr'}>
              {item.label}
            </text>
          ))}
        </g>
      </svg>
    </div>
  )
}
