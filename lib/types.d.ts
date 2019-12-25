export type HttpMethods =
  | 'GET'
  | 'POST'
  | 'DELETE'
  | 'PUT'
  | 'PATCH'
  | 'HEAD'
  | 'OPTIONS';

export type HttpUrl = string;

export type HttpParams = {
  [index: string]: Exclude<
    string | string[] | Date | boolean | number | object,
    null
  >;
};

export type HttpHeaders = { [index: string]: string };

export interface HappyHttpConfig<T = any> {
  readonly method?: HttpMethods;
  readonly baseUrl?: HttpUrl;
  readonly url?: HttpUrl;
  readonly params?: HttpParams;
  readonly headers?: HttpHeaders;
  readonly data?: T;
  readonly responseType?: XMLHttpRequestResponseType;
  readonly credentials?: boolean;
  readonly xsrfCookieName?: string;
  readonly xsrfHeaderName?: string;
  readonly timeout?: number;
  readonly retry?: number;
  readonly retryWhen?: (response: HappyHttpResponse) => boolean;
}

export interface HappyHttpResponse<T = any> {
  readonly data: T;
  readonly status: number;
  readonly statusText: string;
  readonly headers: HttpHeaders;
  readonly config: HappyHttpConfig;
  readonly request: XMLHttpRequest;
}

export interface HttpClientAdapter {
  request<T = any>(options: HappyHttpConfig): Promise<T>;
}
