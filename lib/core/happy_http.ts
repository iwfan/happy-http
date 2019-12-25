import { HttpClientAdapter, HappyHttpConfig } from '../types';
import XHRAdapter from '../adapters/xhr';
import { HttpUrlSerializer } from './http_url_serializer';
import { isValidHttpMethod, isValidHttpUrl } from './validators';

export default class HappyHttp {
  private readonly defaultOptions: HappyHttpConfig = {
    method: 'GET',
    headers: {
      Accept: 'application/json, text/plain, */*'
    },
    responseType: 'json',
    timeout: 0,
    retry: 0
  };

  private readonly urlSerializer = new HttpUrlSerializer();

  private readonly http: HttpClientAdapter = new XHRAdapter();

  constructor(options?: HappyHttpConfig) {
    if (options) {
      this.defaultOptions = options;
    }
  }

  validateOptions(options: HappyHttpConfig): void | never {
    if (!isValidHttpMethod(options.method!)) {
      throw new TypeError(`Invalid HTTP method: ${options.method}`);
    }

    if (!isValidHttpUrl(options.url!)) {
      throw new TypeError(`Invalid HTTP url: ${options.url}`);
    }
  }

  request<T>(options: HappyHttpConfig) {
    this.validateOptions(options);
    options = Object.assign(options, {
      url: this.urlSerializer.serialize(options.url!, options.params)
    });
    return this.http.request<T>(options);
  }
}
