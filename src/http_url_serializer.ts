import { HttpParams } from './types';

const EQUAL_SIGN = '=';
const AMPERSAND_SIGN = '&';
const QUESTION_SIGN = '?';
const REGEXP_OF_STRING_AFTER_HASH = /#.*/;

const isString = (val: any): val is string => typeof val === 'string';

const toString = (val: any) => isString(val) ? val : Object.prototype.toString.call(val);

const isArray = (val: any): val is [] => Array.isArray(val);

const isObject = (val: any): val is object => val !== null && toString(val) === '[object Object]';

const isDate = (val: any): val is Date => toString(val) === '[object Date]';

const queryPairFor = (key: string, value: string) => `${encode(key)}${EQUAL_SIGN}${encode(value)}`;

const encode = (val: string) => encodeURIComponent(val)
  .replace(/%20/g, '+')
  .replace(/%(?:40|3A|24|2C|20|5B|5D|7B|7D)/ig, decodeURIComponent);


export class HttpUrlSerializer {

  public serialize(url: string, params?: HttpParams): string {

    if (!isString(url)) {
      throw new TypeError('"url" is not a string');
    }

    url = url.replace(REGEXP_OF_STRING_AFTER_HASH, '');

    if (params) {
      const queryString = Object.entries(params)
        .map(([key, value]) => {
          if (isDate(value)) { return queryPairFor(key, value.toISOString()); }
          if (isObject(value)) { return queryPairFor(key, JSON.stringify(value)); }
          if (isArray(value)) { return value.map(toString).map(str => queryPairFor(key, str)).join(AMPERSAND_SIGN); }
          return queryPairFor(key, value as string);
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
