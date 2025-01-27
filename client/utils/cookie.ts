export const getLifespan = (days: number) => {
  const age = 60 * 60 * 24 * days
  return new Date(Date.now() + age * 1000).toUTCString()
}

export const setCookie = (props: Record<string, string>) => {
  const cookieString = Object.keys(props)
    .map((key) => `${key}=${props[key]}`)
    .join('; ')
  if (typeof document !== 'undefined') document.cookie = cookieString
}

export const getCookieByKey = (cookie: string, key: string) => {
  return cookie.replace(new RegExp(`(?:(?:^|.*;\\s*)${key}\\s*\\=\\s*([^;]*).*$)|^.*$`), '$1')
}

export const getCookie = (key: string) => {
  return typeof document !== 'undefined' ? getCookieByKey(document.cookie, key) : ''
}
