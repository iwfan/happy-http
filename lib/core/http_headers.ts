import { isNil, isArray } from '../helpers';

export type HttpHeadersInit = { [index: string]: string | string[] };

export type HttpHeadersValue = { [index: string]: string };

export class HttpHeaders {
  private readonly headers = new Map<string, string[]>();

  constructor();
  constructor(init: HttpHeadersInit);
  constructor(headers: HttpHeaders);
  constructor(init?: HttpHeadersInit | HttpHeaders) {
    if (init instanceof HttpHeaders) {
      return init;
    } else if (!isNil(init)) {
      Object.entries(init!).forEach(([key, value]) => {
        this.set(key, value);
      });
    }
  }

  has(key: string) {
    return this.headers.has(key.toLowerCase());
  }

  get(key: string) {
    return this.headers.get(key.toLowerCase());
  }

  set(key: string, value: string | string[]): HttpHeaders {
    this.headers.set(key.toLowerCase(), isArray(value) ? value : [value]);
    return this;
  }

  delete(key: string): HttpHeaders {
    this.headers.delete(key.toLowerCase());
    return this;
  }

  getAll(): HttpHeadersValue {
    return [...this.headers.entries()].reduce(
      (result, [key, value]) => ((result[key] = value.join(',')), result),
      {} as HttpHeadersValue
    );
  }
}
