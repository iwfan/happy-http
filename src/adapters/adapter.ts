import { HttpRequest } from '../core/http_request'
import { HttpResponse } from '../core/http_response'

export interface HttpClientAdapter {
  // setup(): void;
  send<T>(request: HttpRequest): Promise<HttpResponse<T>>
  // teardown(): void;
}
