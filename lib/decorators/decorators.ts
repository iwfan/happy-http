import { Happy, Get } from './happy';

@Happy()
export class Api {
  @Get('http://httpbin.org/get')
  static getUser() {}
}
