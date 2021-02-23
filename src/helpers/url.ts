import { isDate, isPlainObject, encode } from './utils'

export function buildURL(url: string, params?: any): string {
  if (!params) {
    return url
  }

  const parts: string[] = []

  for (let [key, val] of Object.entries(params)) {
    if (val) {
      let values = []
      if (Array.isArray(val)) {
        values = val
        key += '[]'
      } else {
        values = [val]
      }
      values.forEach(value => {
        if (isDate(value)) {
          value = value.toISOString()
        } else if (isPlainObject(value)) {
          value = JSON.stringify(value)
        }
        parts.push(`${encode(key)}=${encode(value)}`)
      })
    }
  }

  let serializedParams = parts.join('&')

  if (serializedParams) {
    if (url.includes('#')) {
      url = url.slice(0, url.indexOf('#'))
    }
    url += (url.includes('?') ? '&' : '?') + serializedParams
  }

  return url
}
