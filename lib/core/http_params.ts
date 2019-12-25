import { isNil } from '../helpers';

export type HttpParamValue = Exclude<
  string | string[] | boolean | number | object | Date | RegExp,
  null
>;

export interface HttpParamsOptions {
  readonly [param: string]: HttpParamValue;
}

export class HttpParams {
  static encode(v: string) {
    return encodeURIComponent(v)
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

  private map = new Map<string, HttpParamValue>();

  /**
   *
   * @param options
   * 1.
   */
  constructor(private readonly options?: HttpParamsOptions) {
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        this.map.set(key, value);
      });
    }
  }

  serialize(): string {
    if (this.map.size === 0) {
      return '';
    }
    return '';
  }
}
