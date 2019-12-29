import { isNil, isDate, isObject, isArray, toString } from '../helpers';

export type HttpParamValue = Exclude<
  string | string[] | boolean | number | object | Date | RegExp,
  null
>;

export interface HttpParamsInit {
  readonly [param: string]: HttpParamValue;
}

export class HttpParams {
  static encode(v: string) {
    return encodeURIComponent(v)
      .replace(/%20/g, '+')
      .replace(/%40/gi, '@')
      .replace(/%3A/gi, ':')
      .replace(/%24/gi, '$')
      .replace(/%2C/gi, ',')
      .replace(/%3B/gi, ';')
      .replace(/%2B/gi, '+')
      .replace(/%3D/gi, '=')
      .replace(/%3F/gi, '?')
      .replace(/%2F/gi, '/');
  }

  static queryPairFor(key: string, value: string) {
    return `${key}=${this.encode(value)}`;
  }

  static arrayQueryPairFor(key: string, value: string) {
    return `${key}[]=${this.encode(value)}`;
  }

  private params = new Map<string, HttpParamValue>();

  constructor(init?: HttpParams | HttpParamsInit) {
    if (init) {
      this.merge(init);
    }
  }

  merge(init: HttpParams | HttpParamsInit): HttpParams {
    const entries =
      init instanceof HttpParams ? init.entries() : Object.entries(init);
    entries.forEach(([key, value]) => {
      this.params.set(key, value);
    });
    return this;
  }

  entries() {
    return [...this.params.entries()];
  }

  serialize(): string {
    return this.entries()
      .map(([key, value]) => {
        if (isDate(value)) {
          return HttpParams.queryPairFor(key, value.toISOString());
        }
        if (isObject(value)) {
          return HttpParams.queryPairFor(key, JSON.stringify(value));
        }
        if (isArray(value)) {
          return value
            .map(toString)
            .map(str => HttpParams.arrayQueryPairFor(key, str))
            .join('&');
        }
        return HttpParams.queryPairFor(key, value as string);
      })
      .join('&');
  }
}
