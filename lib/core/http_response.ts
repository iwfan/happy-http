import { HttpHeaders } from './http_headers';
import { HttpRequest } from './http_request';

export interface HappyHttpResponse<T = any, U = any> {
  readonly data: T;
  readonly status: number;
  readonly statusText: string;
  readonly headers: HttpHeaders;
  readonly request: HttpRequest<U>;
}

export class HttpResponse<T> {
  readonly data?: T;
  readonly status?: number;
  readonly statusText?: string;
  readonly headers?: HttpHeaders;
  readonly request?: HttpRequest;
}
