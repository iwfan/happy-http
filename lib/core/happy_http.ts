import XHRAdapter from '../adapters/xhr';
import { HttpClientAdapter } from '../adapters/adapter';
import { HttpRequest, HttpRequestInit } from './http_request';

export default class HappyHttp {
  private readonly client: HttpClientAdapter;
  private readonly req: HttpRequest;

  constructor(init?: HttpRequest | HttpRequestInit) {
    this.req = init instanceof HttpRequest ? init : new HttpRequest(init);
    this.client = new XHRAdapter();
  }

  request<T>(init?: HttpRequest | HttpRequestInit) {
    if (init) {
      this.req.merge(init);
    }
    this.req.validate();
    this.req.process();
    const response = this.client.send<T>(this.req);
    return response;
  }
}
