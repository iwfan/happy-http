export interface HttpClientAdapter {
  send<T, U>(request: HttpRequest<T>): Promise<HttpResponse<U>>;
}
