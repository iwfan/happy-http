import { HttpRequest, HttpRequestInit } from '../core/http_request';
import HappyHttp from '../core/happy_http';

const happy = Symbol.for('happy');

export function Happy(init?: HttpRequest | HttpRequestInit) {
  return function<T extends { new (...args: any[]): {} }>(constructor: T) {
    // @ts-ignore
    constructor[happy] = new HappyHttp(init);

    return constructor;
  };
}

export function Get(url: string): MethodDecorator {
  // @ts-ignore
  return (target, prop, descriptor: TypedPropertyDescriptor<any>) => {
    descriptor.value = function() {
      // @ts-ignore
      return (target[happy] as HappyHttp).request({ url });
    };

    return descriptor;
  };
}
