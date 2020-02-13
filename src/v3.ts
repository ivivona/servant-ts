/* eslint-disable @typescript-eslint/no-explicit-any */
import { Capture, UniqueCaptures, capture } from "./internal/capture";
import { Equals, Concat, Push } from "type-ts";
import { MimeEncoder, MimeDecoder } from "./internal/mimeType";
import { URLPath, Verb } from "./internal/http";
import { UniqueQueryParam } from "./internal/queryParam";
import { right } from "fp-ts/es6/Either";
import {
  Builder,
  WithResponse,
  WithThrows,
  WithReqHeader,
  WithQuery,
  WithResHeader,
  WithBody
} from "./internal/builderV3";

function verbsWith<M extends unknown[]>(...modifiers: M) {
  function GET<T extends Capture<string, unknown>[]>(
    fragments: TemplateStringsArray,
    ...captures: UniqueCaptures<T>
  ): Builder<M, Concat<[URLPath, Verb<"GET">], T>> {
    throw "unimplemented";
  }

  return {
    GET
  };
}

const encodeJSON = (null as any) as MimeEncoder<any, any>;
const decodeJSON = (null as any) as MimeDecoder<any, any>;

class Auth {}
const WithAuth = {
  auth: function<
    B extends Builder<unknown[], unknown[]>,
    S extends UniqueQueryParam<"auth", B["_A"]>
  >(
    this: Equals<S, "auth"> extends true
      ? B
      : "Auth query parameter already in user"
  ): Builder<B["_C"], Push<Auth, B["_A"]>> {
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
const _api = GET`/api/${capture("aaa", right, "AAA CAPTURE")}/blah/${capture(
  "bbb"
)}`
  .reqHeader("zzz", (_: any) => `${_}`)
  // .auth()
  .throw(encodeJSON, 402)
  .query("aaa", right)
  .query("aaa", right)
  .body(decodeJSON)
  .resHeader("aaa", (_: unknown) => "")
  .response(encodeJSON, 200);
