/* eslint-disable @typescript-eslint/no-explicit-any */
import { Capture, UniqueCaptures, capture } from "./internal/capture";
import { Equals, Concat, Push } from "type-ts";
import { Json } from "./internal/mimeType";
import { URLPath, Verb } from "./internal/http";
import { UniqueQueryParam } from "./internal/queryParam";
import {
  Builder,
  WithResponse,
  WithThrows,
  WithReqHeader,
  WithQuery,
  WithResHeader,
  WithBody
} from "./internal/builder";
import { RemoveAll } from "./internal/util";
import * as t from "io-ts";

function verbsWith<M extends unknown[]>(...modifiers: M) {
  function GET<T extends Capture<string, any>[]>(
    fragments: TemplateStringsArray,
    ...captures: UniqueCaptures<T>
  ): Builder<
    RemoveAll<M, [{ body: unknown }]>,
    Concat<[URLPath, Verb<"GET">], T>
  > {
    throw "unimplemented";
  }
  function POST<T extends Capture<string, any>[]>(
    fragments: TemplateStringsArray,
    ...captures: UniqueCaptures<T>
  ): Builder<M, Concat<[URLPath, Verb<"POST">], T>> {
    throw "unimplemented";
  }

  return {
    GET,
    POST
  };
}

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

const { GET, POST } = verbsWith(
  WithReqHeader,
  WithResHeader,
  WithAuth,
  WithThrows,
  WithQuery,
  WithResponse,
  WithBody
);
const _api = POST`/api/${capture("aaa", t.Int)}/blah/${capture("bbb")}`
  .reqHeader("zzz", t.boolean)
  .reqHeader("zzz1", t.any)
  .auth()
  .throw(Json, t.type({ err: t.string }), 402)
  .query("aaa", t.Int)
  .query("aa", t.boolean)
  .body(Json, t.string)
  .resHeader("aaa", t.string)
  .resHeader("aa", t.Int)
  .response(Json, t.strict({ data: t.any }), 200);
