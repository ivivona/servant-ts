export type StatusCode = number;

export type HTTPMethod =
  | "GET"
  | "HEAD"
  | "PUT"
  | "POST"
  | "DELETE"
  | "CONNECT"
  | "OPTIONS"
  | "TRACE"
  | "PATCH";

export class Verb<M extends HTTPMethod> {
  readonly _M!: M;
  constructor(readonly method: M) {}
}
export interface HasHTTPMethod<M extends HTTPMethod> {
  readonly method: Verb<M>;
}

export class URLPath {
  constructor(readonly path: string) {}
}
export interface HasURLPath {
  readonly path: URLPath;
}
