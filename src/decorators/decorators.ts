import { Happy, Get } from './happy'
import { HttpResponse } from '../core/http_response'

@Happy()
export class Api {
  @Get('http://httpbin.org/get')
  static getUser<T>(): Promise<HttpResponse<T>> {
    // @ts-ignore
    return null
  }
}
