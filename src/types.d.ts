export type HttpMethods =
  | 'GET'
  | 'get'
  | 'POST'
  | 'post'
  | 'DELETE'
  | 'delete'
  | 'PUT'
  | 'put'
  | 'PATCH'
  | 'patch'
  | 'HEAD'
  | 'head'
  | 'OPTIONS'
  | 'options';

export type HttpUrl = string;

export type HttpParams = {
  [index: string]: Exclude<
    string | string[] | Date | boolean | number | object,
    null
  >;
};

export interface HappyHttpOptions {
  readonly method?: HttpMethods;
  readonly url?: HttpUrl;
  readonly params?: HttpParams;
  readonly baseUrl?: HttpUrl;
  readonly headers?: { [index: string]: string };
  readonly data?: any;
  readonly timeout?: number;
  readonly retry?: number;
}

export interface HappyRequestInterface {
  request<T = any>(options: HappyHttpOptions): Promise<T>;
}
