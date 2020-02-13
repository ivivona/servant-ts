/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tail, Equals, Push } from "type-ts";
import { MimeEncoder, MimeType, MimeDecoder } from "./mimeType";
import { StatusCode } from "./http";
import { UniqueStatusCode, ErrorResponse } from "./throw";
import { Response } from "./response";
import {
  UniqueQueryParam,
  FromQueryParam,
  queryParam,
  QueryParam
} from "./queryParam";
import {
  reqHeader,
  resHeader,
  UniqueResHeader,
  HeaderValue,
  ToHeaderValue,
  UniqueReqHeader,
  FromHeaderValue,
  ResHeader,
  ReqHeader
} from "./header";
import { HasBody, RequestBody } from "./body";
import { RemoveAll } from "./util";

type ToUnion<AS extends unknown[]> = {
  "0": unknown;
  n: Equals<AS[0], unknown> extends false ? AS[0] & ToUnion<Tail<AS>> : unknown;
}[AS extends [] ? "0" : "n"];

class BaseBuilder<C extends unknown[], A extends any[]> {
  readonly _C!: C;
  readonly _A!: A;
  private api: A;
}

export type Builder<C extends unknown[], A extends unknown[]> = Readonly<
  ToUnion<C>
> &
  BaseBuilder<C, A>;

export const WithResponse = {
  response: function<
    B extends Builder<unknown[], unknown[]>,
    C extends MimeEncoder<MimeType<unknown>, unknown>,
    S extends StatusCode
  >(
    this: B,
    encoder: C,
    status: UniqueStatusCode<S, B["_A"]>
  ): Push<Response<C, S>, B["_A"]> {
    return [...this.api, new Response(encoder, status)];
  }
};

export const WithThrows = {
  throw: function<
    B extends Builder<unknown[], unknown[]>,
    C extends MimeEncoder<MimeType<unknown>, unknown>,
    S extends StatusCode
  >(
    this: B,
    encoder: C,
    status: UniqueStatusCode<S, B["_A"]>
  ): Builder<B["_C"], Push<ErrorResponse<C, S>, B["_A"]>> {
    const api = [...this.api, new ErrorResponse(encoder, status)];
    return { ...this, api };
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
    decoder: FromQueryParam<O>
  ): Builder<
    RemoveAll<B["_C"], [{ reqHeader: unknown }]>,
    Push<QueryParam<P, O>, B["_A"]>
  > {
    const api = [...this.api, queryParam(param, decoder)];
    return { ...this, api };
  }
};

export const WithResHeader = {
  resHeader: function<
    B extends Builder<unknown[], unknown[]>,
    N extends string,
    O extends HeaderValue,
    I
  >(
    this: B,
    name: UniqueResHeader<N, B["_A"]>,
    encoder: ToHeaderValue<O, I>
  ): Builder<
    RemoveAll<
      B["_C"],
      [{ reqHeader: unknown }, { query: unknown }, { body: unknown }]
    >,
    Push<ResHeader<N, O, I>, B["_A"]>
  > {
    const api = [...this.api, resHeader(name, encoder)];
    return { ...this, api };
  }
};

export const WithReqHeader = {
  reqHeader: function<
    B extends Builder<unknown[], unknown[]>,
    N extends string,
    I extends HeaderValue,
    O
  >(
    this: B,
    name: UniqueReqHeader<N, B["_A"]>,
    decoder: FromHeaderValue<I, O>
  ): Builder<B["_C"], Push<ReqHeader<N, O, I>, B["_A"]>> {
    const api = [...this.api, reqHeader(name, decoder)];
    return { ...this, api };
  }
};

export const WithBody = {
  body: function<
    B extends Builder<unknown[], unknown[]>,
    O,
    M extends MimeType<unknown>,
    D extends MimeDecoder<M, O>
  >(
    this: B,
    mimeDecoder: D
  ): Builder<
    RemoveAll<
      B["_C"],
      [{ reqHeader: unknown }, { query: unknown }, { body: unknown }]
    >,
    Push<RequestBody<D>, B["_A"]>
  > {
    const api = [...this.api, new RequestBody(mimeDecoder)];
    return { ...this, api };
  }
};
