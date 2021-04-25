import XHRAdapter from '../adapters/xhr'
import { HttpClientAdapter } from '../adapters/adapter'
import { HttpRequest, HttpRequestInit } from './http_request'
import { HttpMethods } from '../types'
import { HttpResponse } from './http_response'
import { isNil, isObject, isString } from '../helpers'

export default class HappyHttp {
  private readonly client: HttpClientAdapter
  private readonly req: HttpRequest

  constructor(init?: HttpRequest | HttpRequestInit) {
    this.req = init instanceof HttpRequest ? init : new HttpRequest(init)
    this.client = new XHRAdapter()
  }

  get<T>(url: string, init?: HttpRequest | HttpRequestInit) {
    return this.request<T>(url, 'GET', null, init)
  }

  head<T>(url: string, init?: HttpRequest | HttpRequestInit) {
    return this.request<T>(url, 'HEAD', null, init)
  }

  delete<T>(url: string, init?: HttpRequest | HttpRequestInit) {
    return this.request<T>(url, 'DELETE', null, init)
  }

  options<T>(url: string, init?: HttpRequest | HttpRequestInit) {
    return this.request<T>(url, 'OPTIONS', null, init)
  }

  post<T>(url: string, data?: any, init?: HttpRequest | HttpRequestInit) {
    return this.request<T>(url, 'POST', data, init)
  }

  put<T>(url: string, data?: any, init?: HttpRequest | HttpRequestInit) {
    return this.request<T>(url, 'PUT', data, init)
  }

  patch<T>(url: string, data?: any, init?: HttpRequest | HttpRequestInit) {
    return this.request<T>(url, 'PATCH', data, init)
  }

  request<T>(init?: HttpRequest | HttpRequestInit): Promise<HttpResponse<T>>
  // request<T>(url: string, method: HttpMethods, init?: HttpRequest | HttpRequestInit): Promise<HttpResponse<T>>;
  request<T>(
    url: string,
    method: HttpMethods,
    data: any,
    init?: HttpRequest | HttpRequestInit
  ): Promise<HttpResponse<T>>
  request<T>(
    urlOrInit?: string | HttpRequest | HttpRequestInit,
    method?: HttpMethods,
    data?: any,
    init?: HttpRequest | HttpRequestInit
  ) {
    if (urlOrInit) {
      if (isString(urlOrInit) && !isNil(method)) {
        const request: HttpRequestInit = { url: urlOrInit, method, data }
        this.req.merge(request)
        if (init) {
          this.req.merge(init)
        }
      } else if (urlOrInit instanceof HttpRequest) {
        this.req.merge(urlOrInit as HttpRequest)
      } else if (isObject(urlOrInit)) {
        this.req.merge(urlOrInit as HttpRequestInit)
      }
    }
    this.req.validate()
    this.req.process()
    return this.client.send<T>(this.req)
  }
}
