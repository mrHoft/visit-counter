export type TCounterType = 'badge' | 'number' | 'classic'

export default function getCounter(n: number, type: TCounterType = 'badge', title?: string, color?: string) {
  switch (type) {
    case 'badge':
      return badge(n, title, color)
    case 'number':
      return n.toString()
    case 'classic':
      return classic(n)
  }
}

const classic = (n: number) => {
  const PLACES = 4
  const countArray = n.toString().padStart(PLACES, '0').split('')
  const parts = countArray.reduce(
    (acc, next, i) => `
        ${acc}
        <rect id="Rectangle" fill="#000000" x="${i * 32}" y="0.5" width="29" height="29"></rect>
        <text id="0" font-family="Courier" font-size="24" font-weight="normal" fill="#00FF13">
            <tspan x="${i * 32 + 7}" y="22">${next}</tspan>
        </text>`,
    '',
  )

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${
    PLACES * 32
  }px" height="30px" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>Count</title>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      ${parts}
    </g>
</svg>`
}

const badge = (n: number, title: string = 'Visit counter', color: string = '#007ec6') => {
  const w1 = title.length * 8
  const w2 = Math.max(n.toString().length * 8.5, 20)
  const w = w1 + w2
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="20">
  <title>${title}: ${n}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1" />
    <stop offset="1" stop-opacity=".1" />
  </linearGradient>
  <clipPath id="r"><rect width="${w}" height="20" rx="3" fill="#fff" /></clipPath>
  <g clip-path="url(#r)">
    <rect width="${w1}" height="20" fill="#555" />
    <rect x="${w1}" width="${w2}" height="20" fill="${color}" />
    <rect width="${w}" height="20" fill="url(#s)" />
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Arial,sans-serif" text-rendering="geometricPrecision" font-size="110" transform="scale(.1)">
    <text x="${(w1 * 10) / 2}" y="150" fill="#010101" fill-opacity=".3">${title}</text>
    <text x="${(w1 * 10) / 2}" y="140" fill="#fff">${title}</text>
    <text x="${w1 * 10 + (w2 * 10) / 2}" y="150" fill="#010101" fill-opacity=".3">${n}</text>
    <text x="${w1 * 10 + (w2 * 10) / 2}" y="140" fill="#fff">${n}</text>
  </g>
</svg>`
}
