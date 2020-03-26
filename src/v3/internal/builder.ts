/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tail, Equals, Push } from "type-ts";
import { MimeType } from "./mimeType";
import { StatusCode } from "./http";
import { UniqueStatusCode, ErrorResponse, Response } from "./response";
import { UniqueQueryParam, queryParam, QueryParam } from "./queryParam";
import {
  reqHeader,
  resHeader,
  UniqueResHeader,
  UniqueReqHeader,
  ResHeader,
  ReqHeader
} from "./header";
import { RequestBody } from "./body";
import { RemoveAll } from "./util";
import { Type } from "io-ts";

type ToUnion<AS extends unknown[]> = {
  "0": unknown;
  n: Equals<AS[0], unknown> extends false ? AS[0] & ToUnion<Tail<AS>> : unknown;
}[AS extends [] ? "0" : "n"];

class BaseBuilder<C extends unknown[], A extends any[]> {
  readonly _C!: C;
  readonly _A!: A;
  private api!: A;
}

function api<B extends Builder<unknown[], unknown[]>>(builder: B): B["_A"] {
  return (builder as any).api as B["_A"];
}

export type Builder<C extends unknown[], A extends unknown[]> = Readonly<
  ToUnion<C>
> &
  BaseBuilder<C, A>;

export const WithResponse = {
  response: function<
    B extends Builder<unknown[], unknown[]>,
    M extends MimeType<unknown>,
    R,
    S extends StatusCode
  >(
    this: B,
    mimeType: M,
    encoder: Type<R, M["_T"], unknown>,
    status: UniqueStatusCode<S, B["_A"]>
  ): Push<Response<M, R, S>, B["_A"]> {
    return [...api(this), new Response(mimeType, encoder, status as S)] as Push<
      Response<M, R, S>,
      B["_A"]
    >;
  }
};

export const WithThrows = {
  throw: function<
    B extends Builder<unknown[], unknown[]>,
    M extends MimeType<unknown>,
    R,
    S extends StatusCode
  >(
    this: B,
    mimeType: M,
    encoder: Type<R, M["_T"], unknown>,
    status: UniqueStatusCode<S, B["_A"]>
  ): Builder<B["_C"], Push<ErrorResponse<M, R, S>, B["_A"]>> {
    const newApi = [
      ...api(this),
      new ErrorResponse(mimeType, encoder, status as S)
    ] as Push<ErrorResponse<M, R, S>, B["_A"]>;
    return { ...this, api: newApi };
  }
};

export const WithQuery = {
  query: function<
    B extends Builder<unknown[], unknown[]>,
    P extends string,
    O = string
  >(
    this: B,
    param: UniqueQueryParam<P, B["_A"]>,
    decoder: Type<O, unknown, unknown>
  ): Builder<
    RemoveAll<B["_C"], [{ reqHeader: unknown }]>,
    Push<QueryParam<P, O>, B["_A"]>
  > {
    const newApi = [...api(this), queryParam(param, decoder)];
    return { ...this, api: newApi };
  }
};

export const WithResHeader = {
  resHeader: function<
    B extends Builder<unknown[], unknown[]>,
    N extends string,
    I
  >(
    this: B,
    name: UniqueResHeader<N, B["_A"]>,
    encoder: Type<I, unknown, unknown>
  ): Builder<
    RemoveAll<
      B["_C"],
      [{ reqHeader: unknown }, { query: unknown }, { body: unknown }]
    >,
    Push<ResHeader<N, I>, B["_A"]>
  > {
    const newApi = [...api(this), resHeader(name, encoder)];
    return { ...this, api: newApi } as Builder<
      RemoveAll<
        B["_C"],
        [{ reqHeader: unknown }, { query: unknown }, { body: unknown }]
      >,
      Push<ResHeader<N, I>, B["_A"]>
    >;
  }
};

export const WithReqHeader = {
  reqHeader: function<
    B extends Builder<unknown[], unknown[]>,
    N extends string,
    O
  >(
    this: B,
    name: UniqueReqHeader<N, B["_A"]>,
    decoder: Type<O, unknown, unknown>
  ): Builder<B["_C"], Push<ReqHeader<N, O>, B["_A"]>> {
    const newApi = [...api(this), reqHeader(name, decoder)];
    return { ...this, api: newApi } as Builder<
      B["_C"],
      Push<ReqHeader<N, O>, B["_A"]>
    >;
  }
};

export const WithBody = {
  body: function<
    B extends Builder<unknown[], unknown[]>,
    M extends MimeType<unknown>,
    A
  >(
    this: B,
    mimeType: M,
    decoder: Type<A, unknown, unknown>
  ): Builder<
    RemoveAll<
      B["_C"],
      [{ reqHeader: unknown }, { query: unknown }, { body: unknown }]
    >,
    Push<RequestBody<M, A>, B["_A"]>
  > {
    const newApi = [...api(this), new RequestBody(mimeType, decoder)];
    return { ...this, api: newApi } as Builder<
      RemoveAll<
        B["_C"],
        [{ reqHeader: unknown }, { query: unknown }, { body: unknown }]
      >,
      Push<RequestBody<M, A>, B["_A"]>
    >;
  }
};
