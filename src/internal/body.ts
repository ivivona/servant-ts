import { MimeDecoder, MimeType } from "./mimeType";

export class RequestBody<
  D extends MimeDecoder<MimeType<unknown>, unknown, unknown>
> {
  readonly _D!: D;
  constructor(readonly decoder: D) {}
}

export interface HasBody<
  D extends MimeDecoder<MimeType<unknown>, unknown, unknown>
> {
  readonly body: RequestBody<D>;
}
