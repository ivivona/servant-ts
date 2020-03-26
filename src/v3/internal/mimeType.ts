export class MimeType<T> {
  readonly _T!: T;
  constructor(readonly mimeType: string) {}
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

export interface Json extends MimeType<JsonValue> {
  readonly URI: "JSON";
}

export const Json = new MimeType<JsonValue>(
  "application/json; charset=utf-8"
) as Json;

export interface PlainText extends MimeType<string> {
  readonly URI: "PlainText";
}

export const PlainText = new MimeType<string>(
  "text/plain; charset=utf-8"
) as PlainText;
