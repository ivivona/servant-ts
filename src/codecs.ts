import { MimeDecoder, MimeEncoder, Json as JsonMimeType, JsonC } from "./core";
import { Either } from "fp-ts/lib/Either";

export function fromJson<A, E = unknown>(
  decoder: (a: JsonC["_T"]) => Either<E, A>
): MimeDecoder<JsonC, A, E> {
  return new MimeDecoder(JsonMimeType, decoder);
}

export function asJson<A>(
  encoder: (a: A) => JsonC["_T"]
): MimeEncoder<JsonC, A> {
  return new MimeEncoder(JsonMimeType, encoder);
}
