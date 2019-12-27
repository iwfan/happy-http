import { HttpRequest } from '../core/http_request';
import { HttpResponse } from '../core/http_response';

export interface HttpClientAdapter {
  send<T>(request: HttpRequest): Promise<HttpResponse<T>>;
}
