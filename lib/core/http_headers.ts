import { isArray, isNil } from '../helpers';

export type HttpHeadersInit = { [index: string]: string | string[] };

export type HttpHeadersValue = { [index: string]: string };

export class HttpHeaders {
  private readonly headers = new Map<string, string[]>();

  constructor(init?: HttpHeadersInit | HttpHeaders) {
    this.set('Accept', ['application/json', 'text/plain', '*/*']);
    if (init) {
      this.merge(init);
    }
  }

  merge(init: HttpHeadersInit | HttpHeaders): HttpHeaders {
    const headers = init instanceof HttpHeaders ? init.getAll() : init;
    Object.entries(headers).forEach(([key, value]) => {
      this.set(key, value);
    });
    return this;
  }

  has(key: string) {
    return this.headers.has(key.toLowerCase());
  }

  get(key: string) {
    const value = this.headers.get(key.toLowerCase());
    return isNil(value) ? null : value!.join(', ');
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
      (result, [key, value]) => ((result[key] = value.join(', ')), result),
      {} as HttpHeadersValue
    );
  }
}
