import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../types'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { data = null, method = 'get', url, headers, responseType, timeout } = config

    const request = new XMLHttpRequest()

    if (responseType) {
      request.responseType = responseType
    }

    if (timeout) {
      request.timeout = timeout
    }

    request.open(method.toUpperCase(), url!, true)

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

      handleResponse(response)
    }

    request.onerror = function() {
      reject(createError('NetWork Error', config, null, request))
    }

    request.ontimeout = function() {
      reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request))
    }

    for (let [key, val] of Object.entries(headers)) {
      if (typeof val === 'string') {
        request.setRequestHeader(key, val)
      }
    }

    request.send(data)

    function handleResponse(response: AxiosResponse): void {
      if (response.status >= 200 && response.status < 300) {
        resolve(response)
      } else {
        reject(createError(`Request failed with status code ${response.status}`, config, null, request, response))
      }
    }

  })
}
