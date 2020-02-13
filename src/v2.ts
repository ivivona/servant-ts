/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Capture,
  HasCaptures,
  UniqueCaptures,
  capture
} from "./internal/capture";
import { Equals } from "type-ts";
import { MimeEncoder, MimeDecoder } from "./internal/mimeType";
import { HasHTTPMethod, HasURLPath, StatusCode } from "./internal/http";
import { AddThrow } from "./internal/throw";
import { AddQueryParam, UniqueQueryParam } from "./internal/queryParam";
import { right } from "fp-ts/es6/Either";
import {
  Builder,
  WithResponse,
  WithThrows,
  WithReqHeader,
  WithQuery,
  WithResHeader,
  WithBody
} from "./internal/builder";

function verbsWith<M extends unknown[]>(...modifiers: M) {
  function GET<T extends Capture<string, unknown>[]>(
    fragments: TemplateStringsArray,
    ...captures: UniqueCaptures<T>
  ): Builder<M, HasURLPath & HasHTTPMethod<"GET"> & HasCaptures<T>> {
    throw "unimplemented";
  }

  return {
    GET
  };
}

type HasAuth<S extends string, C extends StatusCode> = {
  auth: [S, C];
};

const encodeJSON = (null as any) as MimeEncoder<any, any>;
const decodeJSON = (null as any) as MimeDecoder<any, any>;
const WithAuth = {
  auth: function<
    B extends Builder<unknown[], unknown>,
    S extends UniqueQueryParam<"auth", B["_A"]>
  >(
    this: Equals<S, "auth"> extends true
      ? B
      : "Auth query parameter already in user"
  ): Builder<
    B["_C"],
    AddQueryParam<
      S,
      AddThrow<300, typeof encodeJSON, B["_A"]> & HasAuth<S, 300>
    >
  > {
    throw "unimplemented";
  }
};
const { GET } = verbsWith(
  WithReqHeader,
  WithResHeader,
  WithAuth,
  WithThrows,
  WithQuery,
  WithResponse,
  WithBody
);
const _api = GET`/api/${capture("aaa", right, "AAA CAPTURE")}`
  .reqHeader("zzz", (_: any) => `${_}`)
  .auth()
  .throw(encodeJSON, 402)
  .query("aaa", right)
  .query("bbb", right)
  .body(decodeJSON)
  .resHeader("aaa", (_: any) => "")
  .response(encodeJSON, 200);
