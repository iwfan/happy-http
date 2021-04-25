import { HttpHeaders } from './http_headers'
import { HttpRequest } from './http_request'

export class HttpResponse<T = any> {
  public readonly error!: string

  constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly data: T,
    public readonly headers: HttpHeaders,
    public readonly request: HttpRequest,
    error?: string
  ) {
    if (error) {
      this.error = error
    }
  }
}
