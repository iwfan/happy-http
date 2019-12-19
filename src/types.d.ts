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
  | 'options'

export type HttpUrl = string

export type HttpParams = {
  [index: string]: Exclude<
    string | string[] | Date | boolean | number | object,
    null
  >
}

export interface HappyHttpOptions {
  method: HttpMethods
  url: HttpUrl
  params: HttpParams
}

export interface HappyHttpInterface {
  request<T = any>(options: HappyHttpOptions): Promise<T>
}
