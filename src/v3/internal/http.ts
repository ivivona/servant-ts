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
  readonly URI = "Verb";
  readonly _M!: M;
  constructor(readonly method: M) {}
}

export class URLPath {
  readonly URI = "URLPath";
  constructor(readonly path: string) {}
}
