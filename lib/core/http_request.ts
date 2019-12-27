import { HttpParams, HttpParamsInit } from './http_params';
import { HttpHeadersInit, HttpHeaders } from './http_headers';
import { HttpMethods, HttpUrl } from '../types';
import { isNil, isString, isObject } from '../helpers';

export interface HttpRequestInit<T = any> {
  readonly method?: HttpMethods;
  readonly baseUrl?: HttpUrl;
  readonly url?: HttpUrl;
  readonly params?: HttpParamsInit | HttpParams;
  readonly headers?: HttpHeadersInit | HttpHeaders;
  readonly body?: T;
  readonly responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
  readonly withCredentials?: boolean;
  // readonly xsrfCookieName?: string;
  // readonly xsrfHeaderName?: string;
  readonly timeout?: number;
  // readonly retry?: number;
  // readonly retryWhen?: (response: HappyHttpResponse) => boolean;
}

export class HttpRequest<T = any> implements HttpRequestInit {
  readonly method?: HttpMethods = 'GET';
  readonly baseUrl?: HttpUrl;
  readonly url?: HttpUrl;
  readonly params?: HttpParamsInit | HttpParams;
  readonly headers?: HttpHeadersInit | HttpHeaders;
  readonly body?: T;
  readonly responseType?: 'arraybuffer' | 'blob' | 'json' | 'text' = 'json';
  readonly withCredentials?: boolean;
  readonly timeout?: number;

  constructor(init?: HttpRequestInit) {
    if (init) {
      this.method = init.method
        ? (init.method.toUpperCase() as HttpMethods)
        : 'GET';

      if (isString(init.baseUrl)) {
        this.baseUrl = init.baseUrl;
      }

      if (isString(init.url)) {
        this.url = init.url;
      }

      if (isObject(init.params)) {
        this.params = new HttpParams(init.params);
      }

      if (isObject(init.headers)) {
        this.headers = new HttpHeaders(init.headers);
      }

      if (!isNil(init.body)) {
        this.body = init.body;
      }

      if (!isNil(init.withCredentials)) {
        this.withCredentials = init.withCredentials;
      }

      if (!isNil(init.timeout)) {
        this.timeout = init.timeout;
      }
    }
  }

  merge(init: HttpRequestInit): void;
  merge(init: HttpRequest): void {
    Object.assign<HttpRequest, { responseType: 'json' }>(this, {
      responseType: 'json'
    });
    // this.responseType = Text;
  }

  validate(): void | never {}
}
