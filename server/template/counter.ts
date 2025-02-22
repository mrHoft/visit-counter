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

const logo =
  /* svg */ `<path fill="#ff0" d="m8.66,14.24c-1.87-.57-3.23-2.31-3.23-4.37,0-2.52,2.05-4.57,4.57-4.57,1.3,0,2.47.55,3.3,1.42h2.34c-1.11-1.98-3.22-3.32-5.65-3.32-3.57,0-6.47,2.9-6.47,6.47,0,3.11,2.2,5.71,5.12,6.33v-1.96h0Z"/>
<g stroke="#ff0">
<line x1="6.34" y1="17.93" x2="7.06" y2="16.47"/>
<line x1="3.4" y1="15.78" x2="4.59" y2="14.67"/>
<line x1="1.56" y1="12.61" x2="3.11" y2="12.08"/>
<line x1="1.18" y1="8.96" x2="2.81" y2="9.16"/>
<line x1="2.32" y1="5.48" x2="3.75" y2="6.26"/>
<line x1="4.77" y1="2.75" x2="5.72" y2="4.07"/>
<line x1="8.12" y1="1.28" x2="8.47" y2="2.84"/>
<line x1="11.78" y1="1.28" x2="11.47" y2="2.84"/>
<line x1="15.13" y1="2.75" x2="14.22" y2="4.07"/>
</g>
<path fill="#fff" d="m15.78,11.56v.86h-3.25c-.04-1.37,2.12-2.21,2.32-3.44.03-.92-1.37-.82-1.29.11l-.92-.09c.6-3.08,5.23-.76,2.04,1.77-.43.41-.53.46-.75.79h1.84,0Z"/>
<path fill="#fff" d="m12.62,16.93l.9-.11c.02.62.75.95,1.17.49.52-.61-.03-1.67-.87-1.28l.1-.75c.6.08,1.01-.57.63-1.01-.38-.35-.99-.03-1,.5l-.86-.15c.37-2.58,4.6-.65,2.23.99,1.04.19,1.18,1.59.45,2.23-.87.88-2.67.4-2.74-.92h0Z"/>
<rect fill="none" stroke="#888" stroke-miterlimit="1.5" x="10" y="8" width="8" height="10"/>`

const badge = (n: number, title: string = 'Visit counter', color: string = '#007ec6') => {
  const w1 = title.length * 6.5
  const w2 = Math.max(n.toString().length * 8.5, 20)
  const w = 20 + w1 + w2
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="20">
  <title>${title}: ${n}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".2" />
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
