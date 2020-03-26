import { MimeType } from "./mimeType";
import { Type } from "io-ts";

export class RequestBody<M extends MimeType<unknown>, D> {
  readonly URI = "RequestBody";
  readonly _M!: M;
  readonly _D!: D;
  constructor(
    readonly mimeType: M,
    readonly decoder: Type<D, unknown, unknown>
  ) {}
}
