import { HttpParams, HttpParamsInit } from './http_params';
import { HttpHeadersInit, HttpHeaders } from './http_headers';
import { HttpMethods, HttpUrl, Mutable } from '../types';
import {
  isNil,
  isString,
  isObject,
  isEmpty,
  isFormData,
  isBlob,
  isArrayBuffer,
  isArray,
  isNumber
} from '../helpers';

export const SUPPORTED_METHODS = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'HEAD',
  'OPTIONS'
];

export const ALLOW_HAVE_BODY_METHODS = ['GET', 'DELETE', 'HEAD', 'OPTIONS'];

export interface HttpRequestInit<T = any> {
  readonly method?: HttpMethods;
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
  readonly method: HttpMethods = 'GET';
  readonly url?: HttpUrl;
  readonly params: HttpParams = new HttpParams();
  readonly headers: HttpHeaders = new HttpHeaders();
  readonly body?: T;
  readonly responseType: 'arraybuffer' | 'blob' | 'json' | 'text' = 'json';
  readonly withCredentials?: boolean;
  readonly timeout?: number;

  constructor(init?: HttpRequestInit) {
    if (init) {
      this.merge(init);
    }
  }

  private isSupportedMethods(method: string) {
    return SUPPORTED_METHODS.includes(method.toUpperCase());
  }

  private shouldHaveRequestBody(method: string): boolean {
    return ALLOW_HAVE_BODY_METHODS.includes(method.toUpperCase());
  }

  merge(req: HttpRequestInit | HttpRequest): HttpRequest {
    const source: Mutable<HttpRequestInit> = {};

    if (isString(req.method) && this.isSupportedMethods(req.method)) {
      source.method = req.method;
    }

    if (isString(req.url) && !isEmpty(req.url)) {
      source.url = req.url;
    }

    if (isObject(req.params) && !isEmpty(req.params)) {
      source.params = new HttpParams(req.params);
      source.params.merge(this.params);
    }

    if (isObject(req.headers) && !isEmpty(req.headers)) {
      source.headers = new HttpHeaders(req.headers);
      source.headers.merge(this.headers);
    }

    if (!isNil(req.body) && this.shouldHaveRequestBody(req.method as string)) {
      source.body = req.body;
    }

    if (!isNil(req.withCredentials)) {
      source.withCredentials = req.withCredentials;
    }

    if (!isNil(req.timeout)) {
      source.timeout = req.timeout;
    }

    Object.assign<HttpRequest, HttpRequestInit>(this, source);
    return this;
  }

  validateAndRepair(): void | never {
    if (!SUPPORTED_METHODS.includes(this.method!.toUpperCase())) {
      throw new TypeError(`Unsupported http methods: ${this.method}`);
    }
    if (isNil(this.url) || isEmpty(this.url)) {
      throw new TypeError(`Invalid url: ${this.url}`);
    }

    if (!this.headers!.has('Content-Type')) {
      const detectedType = this.addContentTypeHeader();
    }
  }

  addContentTypeHeader(): void {
    /**
     * Browser can auto add content-type header for FormData ang ArrayBuffer.
     */
    if (isNil(this.body) || isFormData(this.body) || isArrayBuffer(this.body)) {
      return;
    }

    if (isBlob(this.body)) {
      if (this.body.type) {
        this.headers.set('Content-Type', this.body.type);
      }
    }

    if (isString(this.body)) {
      this.headers.set('Content-Type', 'text/plain');
    }

    if (isObject(this.body) || isArray(this.body) || isNumber(this.body)) {
      this.headers.set('Content-Type', 'application/json');
    }
  }
}
