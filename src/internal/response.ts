import { StatusCode } from "./http";
import { MimeEncoder, MimeType } from "./mimeType";

export class Response<
  E extends MimeEncoder<MimeType<unknown>, unknown>,
  S extends StatusCode
> {
  constructor(readonly resEncoder: E, readonly status: S) {}
}

export interface HasResponse<
  E extends MimeEncoder<MimeType<unknown>, unknown>,
  S extends StatusCode
> {
  readonly response: Response<E, S>;
}
