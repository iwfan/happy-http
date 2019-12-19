import { HappyRequestInterface, HappyHttpOptions } from './types';
import HappyXHR from './happy_xhr';
import { HttpUrlSerializer } from './http_url_serializer';
import { isValidHttpMethod, isValidHttpUrl } from './validators';

export default class HappyHttp {
  private readonly defaultOptions: HappyHttpOptions = {};

  private readonly urlSerializer = new HttpUrlSerializer();

  private readonly http: HappyRequestInterface = new HappyXHR();

  constructor(options?: HappyHttpOptions) {
    if (options) {
      this.defaultOptions = options;
    }
  }

  validateOptions(options: HappyHttpOptions): void | never {
    if (!isValidHttpMethod(options.method!)) {
      throw new TypeError(`Invalid HTTP method: ${options.method}`);
    }

    if (!isValidHttpUrl(options.url!)) {
      throw new TypeError(`Invalid HTTP url: ${options.url}`);
    }
  }

  request<T>(options: HappyHttpOptions) {
    this.validateOptions(options);
    options = Object.assign(options, {
      url: this.urlSerializer.serialize(options.url!, options.params)
    });
    return this.http.request<T>(options);
  }
}
