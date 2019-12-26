import { HttpParams, HttpParamsInit } from './http_params';
import { HttpHeadersInit, HttpHeaders } from './http_headers';
import { HttpMethods, HttpUrl } from '../types';

export interface HttpRequestInit<T = any> {
  readonly method?: HttpMethods;
  readonly baseUrl?: HttpUrl;
  readonly url?: HttpUrl;
  readonly params?: HttpParamsInit | HttpParams;
  readonly headers?: HttpHeadersInit | HttpHeaders;
  readonly body?: T;
  readonly responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
  readonly credentials?: boolean;
  readonly xsrfCookieName?: string;
  readonly xsrfHeaderName?: string;
  readonly timeout?: number;
  // readonly retry?: number;
  // readonly retryWhen?: (response: HappyHttpResponse) => boolean;
}

export class HttpRequest<T = any> implements HttpRequestInit {
  readonly method?: HttpMethods;
  readonly baseUrl?: HttpUrl;
  readonly url?: HttpUrl;
  readonly params?: HttpParamsInit | HttpParams;
  readonly headers?: HttpHeadersInit | HttpHeaders;
  readonly body?: T;
  readonly responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
  readonly credentials?: boolean;
  readonly xsrfCookieName?: string;
  readonly xsrfHeaderName?: string;
  readonly timeout?: number;

  constructor(readonly init?: HttpRequestInit) {
    this.responseType = 'json';

    // this.headers = new HttpHeaders(init?.headers);
  }

  test() {
    Object.assign<HttpRequest, { responseType: 'json' }>(this, {
      responseType: 'json'
    });
    // this.responseType = Text;
  }
}
