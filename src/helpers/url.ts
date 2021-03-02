import { isDate, isPlainObject, encode } from './utils'

interface URLOrigin {
  protocol: string
  host: string
}

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

const urlParsingNode = document.createElement('a')
const currentOrigin = resolveURL(window.location.href)

export function isURLSameOrigin(requestURL: string): boolean {
  const parsedOrigin = resolveURL(requestURL)
  return (parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host)
}

function resolveURL(url: string): URLOrigin {
  // 通过创建一个 <a> 标签并设置 href 属性可以快捷的拿到 protocol 和 host
  urlParsingNode.setAttribute('href', url)
  const { protocol, host } = urlParsingNode

  return {
    protocol,
    host
  }
}
