import { Either } from "fp-ts/es6/Either";

export class MimeType<T> {
  readonly _T!: T;
  readonly mimeType!: string;
}
type JsonValue =
  | null
  | string
  | number
  | boolean
  | {
      [x: string]: JsonValue | undefined;
    }
  | JsonValue[];
export class JsonC extends MimeType<JsonValue> {
  readonly mimeType: string = "application/json; charset=utf-8";
}
export const Json = new JsonC();
class PlainTextC extends MimeType<string> {
  readonly mimeType: string = "text/plain; charset=utf-8";
}
export const PlainText = new PlainTextC();

export const Empty = (): JsonValue => null;

export class MimeDecoder<M extends MimeType<unknown>, O, E = unknown> {
  readonly _O!: O;
  constructor(
    readonly contentType: M,
    readonly decoder: (input: M["_T"]) => Either<E, O>
  ) {}
}

export class MimeEncoder<M extends MimeType<unknown>, I> {
  readonly _I!: I;
  constructor(
    readonly contentType: M,
    readonly encoder: (input: I) => M["_T"]
  ) {}
}
