import XHRAdapter from '../adapters/xhr';
import { HttpClientAdapter } from '../adapters/adapter';
import { HttpRequest, HttpRequestInit } from './http_request';
import { HttpResponse } from './http_response';

export default class HappyHttp {
  // private readonly defaultOptions: HappyHttpConfig = {
  //   method: 'GET',
  //   headers: {
  //     Accept: 'application/json, text/plain, */*'
  //   },
  //   responseType: 'json',
  //   timeout: 0,
  //   retry: 0
  // };

  private readonly client: HttpClientAdapter;
  private readonly req: HttpRequest;

  constructor();
  constructor(init: HttpRequestInit);
  constructor(req: HttpRequest);
  constructor(init?: HttpRequest | HttpRequestInit) {
    this.req = init instanceof HttpRequest ? init : new HttpRequest(init);

    this.client = new XHRAdapter();
  }

  request<T>(): Promise<HttpResponse<T>>;
  request<T>(init: HttpRequestInit): Promise<HttpResponse<T>>;
  request<T>(req: HttpRequest): Promise<HttpResponse<T>>;
  request<T>(init?: HttpRequest | HttpRequestInit): Promise<HttpResponse<T>> {
    if (init) {
      this.req.merge(init);
    }

    this.req.validate();

    const response = this.client.send<T>(this.req);
    return response;
  }
}
