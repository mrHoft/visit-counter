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

const logo = /* svg */ `<g fill="none">
<g stroke="#ff0">
<path stroke-width="2px" d="m8.72,14.4c-1.91-.55-3.3-2.31-3.3-4.4,0-2.53,2.05-4.58,4.58-4.58,1.23,0,2.34.48,3.17,1.27"/>
<line x1="6.97" y1="16.78" x2="7.55" y2="15.54"/>
<line x1="2.93" y1="12.29" x2="4.23" y2="11.84"/>
<line x1="3.56" y1="6.29" x2="4.76" y2="6.95"/>
<line x1="8.44" y1="2.74" x2="8.74" y2="4.07"/>
<line x1="4.47" y1="14.96" x2="5.47" y2="14.03"/>
<line x1="2.61" y1="9.22" x2="3.97" y2="9.38"/>
<line x1="5.62" y1="4" x2="6.42" y2="5.11"/>
<line x1="11.53" y1="2.74" x2="11.26" y2="4.07"/>
<line x1="14.34" y1="4" x2="13.57" y2="5.11"/>
</g>
<g stroke="gray" stroke-width="1.5px">
<circle cx="10" cy="10" r="2"/>
<path d="m15.17,7.08c.49.86.77,1.86.77,2.92,0,3.28-2.66,5.93-5.93,5.93"/>
<line x1="10" y1="17.45" x2="10" y2="12.34"/>
<line x1="16.12" y1="10" x2="17.45" y2="10"/>
<line x1="13.09" y1="15.37" x2="13.72" y2="16.45"/>
<line x1="12.02" y1="11.14" x2="16.45" y2="13.72"/>
<line x1="11.96" y1="8.8" x2="16.45" y2="6.28"/>
</g>
</g>`

const badge = (n: number, title: string = 'Visit counter', color: string = '#007ec6') => {
  const w1 = title.length * 6.5
  const w2 = Math.max(n.toString().length * 8.5, 20)
  const w = 20 + w1 + w2
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="20">
  <title>${title}: ${n}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1" />
    <stop offset="1" stop-opacity=".1" />
  </linearGradient>
  <clipPath id="r"><rect width="${w}" height="20" rx="3" fill="#fff" /></clipPath>
  <g clip-path="url(#r)">
    <rect width="${20 + w1}" height="20" fill="#333" />
    <rect x="${20 + w1}" width="${w2}" height="20" fill="${color}" />
    <rect width="${w}" height="20" fill="url(#s)" />
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Arial,Geneva,sans-serif" text-rendering="geometricPrecision" font-size="110" transform="scale(.1)">
    <text x="${200 + (w1 * 10) / 2}" y="150" fill="#000" fill-opacity=".3">${title}</text>
    <text x="${200 + (w1 * 10) / 2}" y="140" fill="#fff">${title}</text>
    <text x="${200 + w1 * 10 + (w2 * 10) / 2}" y="150" fill="#000" fill-opacity=".3">${n}</text>
    <text x="${200 + w1 * 10 + (w2 * 10) / 2}" y="140" fill="#fff">${n}</text>
  </g>
  ${logo}
</svg>`
}
