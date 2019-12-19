import { HttpParams } from './types'

const EQUAL_SIGN = '='
const AMPERSAND_SIGN = '&'
const QUESTION_SIGN = '?'
const REGEXP_OF_STRING_AFTER_HASH = /#.*/

const assert = (condition: boolean, msg: string = 'Assertion Error') => {
  if (!condition) {
    throw new Error(msg)
  }
}

const toTypeString = (val: any) => Object.prototype.toString.call(val)

const isString = (val: any): val is string => typeof val === 'string'

const isArray = (val: any): val is any[] => Array.isArray(val)

const isObject = (val: any): val is object =>
  val !== null && toTypeString(val) === '[object Object]'

const isDate = (val: any): val is Date => toTypeString(val) === '[object Date]'

const toString = (val: any) =>
  isObject(val) || isArray(val) ? JSON.stringify(val) : `${val}`

const queryPairFor = (key: string, value: string, isArray?: boolean) =>
  `${encode(key)}${isArray ? '[]' : ''}${EQUAL_SIGN}${encode(value)}`

const encode = (val: string) =>
  encodeURIComponent(val)
    .replace(/%20/g, '+')
    .replace(/%(?:40|3A|24|2C|20|5B|5D|7B|7D|22)/gi, decodeURIComponent)

export class HttpUrlSerializer {
  public serialize(url: string, params?: HttpParams): string {
    assert(isString(url), '"url" is not a string')

    url = url.replace(REGEXP_OF_STRING_AFTER_HASH, '')

    if (params) {
      const queryString = Object.entries(params)
        .map(([key, value]) => {
          if (isDate(value)) {
            return queryPairFor(key, value.toISOString())
          }
          if (isObject(value)) {
            return queryPairFor(key, JSON.stringify(value))
          }
          if (isArray(value)) {
            return value
              .map(toString)
              .map(str => queryPairFor(key, str, true))
              .join(AMPERSAND_SIGN)
          }
          return queryPairFor(key, value as string)
        })
        .reduce(
          (qs, queryPair) => `${qs}${queryPair}${AMPERSAND_SIGN}`,
          url.includes(QUESTION_SIGN) ? AMPERSAND_SIGN : QUESTION_SIGN
        )
        .slice(0, -1)

      url += queryString
    }

    return url
  }
}
