import { HttpParams } from '../types';
import {
  assert,
  isArray,
  isDate,
  isObject,
  isString,
  toString
} from '../helpers';
import {
  AMPERSAND_SIGN,
  EQUAL_SIGN,
  QUESTION_SIGN,
  REGEXP_OF_STRING_AFTER_HASH
} from '../constants';

export class HttpUrlSerializer {
  private static encode(val: string): string {
    return encodeURIComponent(val)
      .replace(/%20/g, '+')
      .replace(/%(?:40|3A|24|2C|20|5B|5D|7B|7D|22)/gi, decodeURIComponent);
  }

  private static queryPairFor(key: string, value: string, isArray?: boolean) {
    return `${this.encode(key)}${isArray ? '[]' : ''}${EQUAL_SIGN}${this.encode(
      value
    )}`;
  }

  public serialize(url: string, params?: HttpParams): string {
    assert(isString(url), '"url" is not a string');

    url = url.replace(REGEXP_OF_STRING_AFTER_HASH, '');

    if (params) {
      const queryString = Object.entries(params)
        .map(([key, value]) => {
          if (isDate(value)) {
            return HttpUrlSerializer.queryPairFor(key, value.toISOString());
          }
          if (isObject(value)) {
            return HttpUrlSerializer.queryPairFor(key, JSON.stringify(value));
          }
          if (isArray(value)) {
            return value
              .map(toString)
              .map(str => HttpUrlSerializer.queryPairFor(key, str, true))
              .join(AMPERSAND_SIGN);
          }
          return HttpUrlSerializer.queryPairFor(key, value as string);
        })
        .reduce(
          (qs, queryPair) => `${qs}${queryPair}${AMPERSAND_SIGN}`,
          url.includes(QUESTION_SIGN) ? AMPERSAND_SIGN : QUESTION_SIGN
        )
        .slice(0, -1);

      url += queryString;
    }

    return url;
  }
}
