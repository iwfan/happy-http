import { HttpRequest } from '../core/http_request';
import { HttpResponse } from '../core/http_response';

export interface HttpClientAdapter {
  send<T, U>(request: HttpRequest<T>): Promise<HttpResponse<U>>;
}
