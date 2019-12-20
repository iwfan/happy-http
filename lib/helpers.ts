export const assert = (condition: boolean, msg: string = 'Assertion Error') => {
  if (!condition) {
    throw new Error(msg);
  }
};

export const toTypeString = (val: any) => Object.prototype.toString.call(val);

export const isString = (val: any): val is string => typeof val === 'string';

export const isArray = (val: any): val is any[] => Array.isArray(val);

export const isObject = (val: any): val is object =>
  val !== null && toTypeString(val) === '[object Object]';

export const isDate = (val: any): val is Date =>
  toTypeString(val) === '[object Date]';

export const toString = (val: any) =>
  isObject(val) || isArray(val) ? JSON.stringify(val) : `${val}`;

export const isNil = (val: any) => val == null;

export const isEmpty = (val: any) => {
  if (isNil(val)) {
    return true;
  }
  if (isString(val) || isArray(val)) {
    return val.length !== 0;
  }
  if (isObject(val)) {
    return Object.keys(val).length !== 0;
  }
  return false;
};

export const merge = <T, U>(target: T, source: U) =>
  Object.assign(target, source);
