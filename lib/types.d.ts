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

export type HttpHeaders = { [index: string]: string };

export interface HappyHttpConfig {
  readonly method?: HttpMethods;
  readonly url?: HttpUrl;
  readonly params?: HttpParams;
  readonly baseUrl?: HttpUrl;
  readonly headers?: { [index: string]: string };
  readonly data?: any;
  readonly timeout?: number;
  readonly retry?: number;
  readonly responseType?: XMLHttpRequestResponseType;
}

export interface HappyHttpResponse<T = any> {
  readonly data: T;
  readonly status: number;
  readonly statusText: string;
  readonly headers: HttpHeaders;
  readonly config: HappyHttpConfig;
  readonly request: XMLHttpRequest;
}

export interface HappyHttpAdapter {
  request<T = any>(options: HappyHttpConfig): Promise<T>;
}
