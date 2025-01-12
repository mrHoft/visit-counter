export default function getCounter(n: number) {
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="110" height="20">
  <title>Visit counter: ${n}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1" />
    <stop offset="1" stop-opacity=".1" />
  </linearGradient>
  <clipPath id="r"><rect width="110" height="20" rx="3" fill="#fff" /></clipPath>
  <g clip-path="url(#r)">
    <rect width="76" height="20" fill="#555" />
    <rect x="76" width="34" height="20" fill="#007ec6" />
    <rect width="110" height="20" fill="url(#s)" />
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Arial,sans-serif" text-rendering="geometricPrecision" font-size="110" transform="scale(.1)">
    <text x="380" y="150" fill="#010101" fill-opacity=".3">Visit counter</text>
    <text x="380" y="140" fill="#fff">Visit counter</text>
    <text x="930" y="150" fill="#010101" fill-opacity=".3">${n}</text>
    <text x="930" y="140" fill="#fff">${n}</text>
  </g>
</svg>
`
}
