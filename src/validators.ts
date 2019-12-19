import { HttpMethods, HttpUrl } from './types';
import { isNil, isEmpty, isString } from './helpers';
import { METHODS } from './constants';

export const isValidHttpUrl = (url: HttpUrl) => {
  if (isNil(url)) {
    return false;
  }
  return isEmpty(url);
};

export const isValidHttpMethod = (method: HttpMethods) => {
  if (isNil(method) || !isString(method)) {
    return false;
  }
  return METHODS.includes(method.toUpperCase());
};
