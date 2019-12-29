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
  isNumber,
  isBoolean,
  toString
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

export const NOT_ALLOW_HAVE_BODY_METHODS = ['GET', 'DELETE', 'HEAD', 'OPTIONS'];

export interface HttpRequestInit<T = any> {
  readonly method?: HttpMethods;
  readonly url?: HttpUrl;
  readonly params?: HttpParamsInit | HttpParams;
  readonly headers?: HttpHeadersInit | HttpHeaders;
  readonly data?: T;
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
  readonly url: HttpUrl = '';
  readonly params: HttpParams = new HttpParams();
  readonly headers: HttpHeaders = new HttpHeaders();
  readonly data?: T;
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
    return !NOT_ALLOW_HAVE_BODY_METHODS.includes(method.toUpperCase());
  }

  merge(req: HttpRequestInit | HttpRequest): HttpRequest {
    if (isString(req.method) && this.isSupportedMethods(req.method)) {
      (this as Mutable<HttpRequest>).method = req.method;
    }

    if (isString(req.url) && !isEmpty(req.url)) {
      (this as Mutable<HttpRequest>).url = req.url;
    }

    if (isObject(req.params) && !isEmpty(req.params)) {
      (this as Mutable<HttpRequest>).params.merge(req.params);
    }

    if (isObject(req.headers) && !isEmpty(req.headers)) {
      (this as Mutable<HttpRequest>).headers.merge(req.headers);
    }

    if (!isNil(req.data) && this.shouldHaveRequestBody(req.method as string)) {
      (this as Mutable<HttpRequest>).data = req.data;
    }

    if (!isNil(req.withCredentials)) {
      (this as Mutable<HttpRequest>).withCredentials = req.withCredentials;
    }

    if (!isNil(req.timeout)) {
      (this as Mutable<HttpRequest>).timeout = req.timeout;
    }

    return this;
  }

  validate(): void | never {
    if (!SUPPORTED_METHODS.includes(this.method!.toUpperCase())) {
      throw new TypeError(`Unsupported http methods: ${this.method}`);
    }
    if (isNil(this.url) || isEmpty(this.url)) {
      throw new TypeError(`Invalid url: ${this.url}`);
    }
  }

  private addContentTypeHeader(): void {
    if (this.headers.has('Content-Type')) {
      return;
    }
    /**
     * Browser can auto add content-type header for FormData ang ArrayBuffer.
     */
    if (isNil(this.data) || isFormData(this.data) || isArrayBuffer(this.data)) {
      return;
    }

    if (isBlob(this.data)) {
      if (this.data.type) {
        this.headers.set('Content-Type', this.data.type);
      }
    }

    if (isString(this.data)) {
      this.headers.set('Content-Type', 'text/plain');
    }

    if (
      isObject(this.data) ||
      isArray(this.data) ||
      isNumber(this.data) ||
      isBoolean(this.data)
    ) {
      this.headers.set('Content-Type', 'application/json');
    }
  }

  private generateFullUrl(): void {
    const joiner = this.url.includes('?') ? '&' : '?';
    (this as Mutable<HttpRequest>).url = `${
      this.url
    }${joiner}${this.params.serialize()}`;
  }

  serializeBody() {
    if (isNil(this.data)) {
      return null;
    }

    if (
      isArrayBuffer(this.data) ||
      isFormData(this.data) ||
      isBlob(this.data) ||
      isString(this.data)
    ) {
      return this.data;
    }

    if (
      isObject(this.data) ||
      isArray(this.data) ||
      isNumber(this.data) ||
      isBoolean(this.data)
    ) {
      return JSON.stringify(this.data);
    }

    return toString(this.data);
  }

  process(): void {
    this.generateFullUrl();
    this.addContentTypeHeader();
  }
}
