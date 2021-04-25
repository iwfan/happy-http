export type HttpMethods =
  | 'GET'
  | 'POST'
  | 'DELETE'
  | 'PUT'
  | 'PATCH'
  | 'HEAD'
  | 'OPTIONS'
  | 'get'
  | 'post'
  | 'delete'
  | 'put'
  | 'patch'
  | 'head'
  | 'options'

export type HttpUrl = string

export type Mutable<T> = { -readonly [K in keyof T]: T[K] }
