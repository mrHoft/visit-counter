export const ipToNumber = (ip: string) => {
  const a = ip.split('.')
  return (
    ((parseInt(a[0], 10) << 24) >>> 0) +
    ((parseInt(a[1], 10) << 16) >>> 0) +
    ((parseInt(a[2], 10) << 8) >>> 0) +
    (parseInt(a[3], 10) >>> 0)
  )
}

export const numberToIp = (ip: number) => {
  return [(ip >>> 24) & 0xff, (ip >>> 16) & 0xff, (ip >>> 8) & 0xff, ip & 0xff].join('.')
}
