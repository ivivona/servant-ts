import { StatusCode } from "./http";
import { MimeEncoder, MimeType } from "./mimeType";
import { Hide, NotRepeating } from "./util";
import { Response } from "./response";
import { Push } from "type-ts";

export class ErrorResponse<
  E extends MimeEncoder<MimeType<unknown>, unknown>,
  S extends StatusCode
> {
  constructor(readonly resEncoder: E, readonly status: S) {}
}

export type AddThrow<
  S extends StatusCode,
  M extends MimeEncoder<MimeType<unknown>, unknown>,
  B
> = B extends HasThrows<infer H>
  ? Hide<HasThrows<H>, B> & HasThrows<Push<Response<M, S>, H>>
  : B & HasThrows<[Response<M, S>]>;

export type UniqueStatusCode<S, B> = S extends StatusCode
  ? B extends HasThrows<infer H>
    ? NotRepeating<Push<{ status: S }, H>, "status"> extends never
      ? "Status code already used"
      : S
    : S
  : S;

export interface HasThrows<
  R extends Response<MimeEncoder<MimeType<unknown>, unknown>, StatusCode>[]
> {
  readonly throws: R;
}
