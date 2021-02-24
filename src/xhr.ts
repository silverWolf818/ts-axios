import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from './types'
import { parseHeaders } from './helpers/headers'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise(resolve => {
    const { data = null, method = 'get', url, headers, responseType } = config

    const request = new XMLHttpRequest()

    if (responseType) {
      request.responseType = responseType
    }

    request.open(method.toUpperCase(), url, true)

    request.onreadystatechange = function() {
      if (request.readyState !== 4 || request.status === 0) {
        return
      }

      const response: AxiosResponse = {
        data: responseType === 'text' ? request.responseText : request.response,
        status: request.status,
        statusText: request.statusText,
        headers: parseHeaders(request.getAllResponseHeaders()),
        config,
        request
      }

      resolve(response)
    }

    for (let [key, val] of Object.entries(headers)) {
      if (typeof val === 'string') {
        request.setRequestHeader(key, val)
      }
    }

    request.send(data)
  })
}
