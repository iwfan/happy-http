export const toTypeString = (val: any) =>
  Object.prototype.toString.call(val).replace(/(^\[object )|(\]$)/g, '');

export const isNil = (val: any) => val == null;

export const isString = (val: any): val is string => typeof val === 'string';

export const isNumber = (val: any): val is number => typeof val === 'number';

export const isArray = (val: any): val is any[] => Array.isArray(val);

export const isObject = (val: any): val is object =>
  val !== null && toTypeString(val) === 'Object';

export const isDate = (val: any): val is Date => toTypeString(val) === 'Date';

export const isRegexp = (val: any): val is Date =>
  toTypeString(val) === 'RegExp';

export const toString = (val: any) =>
  isObject(val) || isArray(val) ? JSON.stringify(val) : `${val}`;

export const isMap = (val: any) => toTypeString(val) === 'Map';

export const isSet = (val: any) => toTypeString(val) === 'Set';

export const isArrayBuffer = (val: any): val is ArrayBuffer =>
  toTypeString(val) === 'ArrayBuffer';

export const isBlob = (val: any): val is Blob => toTypeString(val) === 'Blob';

export const isFormData = (val: any): val is FormData =>
  toTypeString(val) === 'FormData';

export const isEmpty = (val: any) => {
  if (isNil(val)) {
    return true;
  }
  if (isString(val) || isArray(val)) {
    return val.length === 0;
  }
  if (isMap(val) || isSet(val)) {
    return val.size === 0;
  }
  if (isObject(val)) {
    return Object.keys(val).length === 0;
  }
  return false;
};
