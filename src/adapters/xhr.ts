import { HttpClientAdapter } from './adapter'
import { HttpRequest } from '../core/http_request'
import { HttpResponse } from '../core/http_response'
import { isBoolean, isNil, isNumber } from '../helpers'
import { HttpHeaders, HttpHeadersValue } from '../core/http_headers'

export default class XHRAdapter implements HttpClientAdapter {
  private setHeaders(xhr: XMLHttpRequest, headers: HttpHeaders) {
    Object.entries(headers.getAll()).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value)
    })
  }

  private getHttpHeaders(xhr: XMLHttpRequest): HttpHeaders {
    const headersStr = xhr.getAllResponseHeaders()

    const headers = headersStr.split('\r\n').reduce((header, headerLine) => {
      const [key, value] = headerLine.split(':')
      if (!isNil(key) && !isNil(value)) {
        header[key] = value.trim()
      }
      return header
    }, {} as HttpHeadersValue)

    return new HttpHeaders(headers)
  }

  private getResponseBody(xhr: XMLHttpRequest): any {
    return xhr.responseType === 'text' ? xhr.responseText : xhr.response
  }

  private createOKResponse<T>(xhr: XMLHttpRequest, request: HttpRequest) {
    return new HttpResponse<T>(
      xhr.status,
      xhr.statusText,
      this.getResponseBody(xhr),
      this.getHttpHeaders(xhr),
      request
    )
  }

  private createErrorResponse(error: string, xhr: XMLHttpRequest, request: HttpRequest) {
    return new HttpResponse(
      xhr.status || 0,
      xhr.statusText || 'Unknown Error',
      null,
      this.getHttpHeaders(xhr),
      request,
      error
    )
  }

  private handleLoad<T>(
    xhr: XMLHttpRequest,
    request: HttpRequest,
    resolve: (value?: any) => void,
    reject: (reason?: any) => void
  ): void {
    if ((200 <= xhr.status && xhr.status < 300) || xhr.status === 304) {
      resolve(this.createOKResponse<T>(xhr, request))
    } else {
      reject(
        this.createErrorResponse(
          `Http failure response for ${request.url}: ${xhr.status} ${xhr.statusText}`,
          xhr,
          request
        )
      )
    }
  }

  private handleError(
    xhr: XMLHttpRequest,
    request: HttpRequest,
    reject: (reason?: any) => void
  ): void {
    reject(this.createErrorResponse(`Network Error`, xhr, request))
  }

  private handleTimeout(
    xhr: XMLHttpRequest,
    request: HttpRequest,
    reject: (reason?: any) => void
  ): void {
    reject(this.createErrorResponse(`Timeout of ${request.timeout}ms exceeded`, xhr, request))
  }

  send<T>(request: HttpRequest): Promise<HttpResponse<T>> {
    return new Promise<HttpResponse<T>>((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.open(request.method, request.url)

      this.setHeaders(xhr, request.headers)

      xhr.responseType = request.responseType

      if (isNumber(request.timeout)) {
        xhr.timeout = request.timeout
        xhr.addEventListener('timeout', () => this.handleTimeout(xhr, request, reject))
      }

      if (isBoolean(request.withCredentials) && request.withCredentials) {
        xhr.withCredentials = true
      }

      xhr.addEventListener('load', () => this.handleLoad<T>(xhr, request, resolve, reject))

      xhr.addEventListener('error', e => {
        this.handleError(xhr, request, reject)
      })

      xhr.send(request.serializeBody())
    })
  }
}
