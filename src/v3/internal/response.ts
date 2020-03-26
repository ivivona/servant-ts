import { StatusCode } from "./http";
import { MimeType } from "./mimeType";
import { Find } from "./util";
import { Type } from "io-ts";

export class Response<M extends MimeType<unknown>, E, S extends StatusCode> {
  readonly URI = "Response";
  constructor(
    readonly mimeType: M,
    readonly encoder: Type<E, M["_T"], unknown>,
    readonly status: S
  ) {}
}

export class ErrorResponse<
  M extends MimeType<unknown>,
  E,
  S extends StatusCode
> {
  readonly URI = "ErrorResponse";
  constructor(
    readonly mimeType: M,
    readonly encoder: Type<E, M["_T"], unknown>,
    readonly status: S
  ) {}
}

export type UniqueStatusCode<S, B extends unknown[]> = S extends StatusCode
  ? Find<ErrorResponse<MimeType<unknown>, unknown, S>, B> extends never
    ? Find<Response<MimeType<unknown>, unknown, S>, B> extends never
      ? S
      : "Status code already declared"
    : "Status code already declared"
  : S;

export class ResponseWithHeaders<A, HS extends object> {
  constructor(readonly response: A, readonly headers: HS) {}
}

export function withHeaders<A, HS extends object>(
  response: A,
  headers: HS
): ResponseWithHeaders<A, HS> {
  return new ResponseWithHeaders(response, headers);
}

export function isResponseWithHeaders<A, HS extends object>(
  response: unknown
): response is ResponseWithHeaders<A, HS> {
  return response instanceof ResponseWithHeaders;
}
