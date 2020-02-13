/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tail, Equals } from "type-ts";
import { MimeEncoder, MimeType, MimeDecoder } from "./mimeType";
import { StatusCode } from "./http";
import { UniqueStatusCode, AddThrow } from "./throw";
import { HasResponse, Response } from "./response";
import {
  UniqueQueryParam,
  FromQueryParam,
  AddQueryParam,
  queryParam
} from "./queryParam";
import {
  reqHeader,
  resHeader,
  AddResHeader,
  UniqueResHeader,
  HeaderValue,
  AddReqHeader,
  ToHeaderValue,
  UniqueReqHeader,
  FromHeaderValue
} from "./header";
import { HasBody, RequestBody } from "./body";
import { RemoveAll } from "./util";

type ToUnion<AS extends unknown[]> = {
  "0": unknown;
  n: Equals<AS[0], unknown> extends false ? AS[0] & ToUnion<Tail<AS>> : unknown;
}[AS extends [] ? "0" : "n"];

class BaseBuilder<C extends unknown[], A> {
  readonly _C!: C;
  readonly _A!: A;
  private api: Readonly<A>;
}

export type Builder<C extends unknown[], A> = Readonly<ToUnion<C>> &
  BaseBuilder<C, A>;

export const WithResponse = {
  response: function<
    B extends Builder<unknown[], unknown>,
    C extends MimeEncoder<MimeType<unknown>, unknown>,
    S extends StatusCode
  >(
    this: B,
    encoder: C,
    status: UniqueStatusCode<S, B["_A"]>
  ): B["_A"] & HasResponse<C, S> {
    return {
      ...this.api,
      response: new Response(encoder, status)
    } as B["_A"] & HasResponse<C, S>;
  }
};

export const WithThrows = {
  throw: function<
    B extends Builder<unknown[], unknown>,
    C extends MimeEncoder<MimeType<unknown>, unknown>,
    S extends StatusCode
  >(
    this: B,
    encoder: C,
    status: UniqueStatusCode<S, B["_A"]>
  ): Builder<B["_C"], AddThrow<S, C, B["_A"]>> {
    const throws = [
      ...((this.api as any).throws ?? []),
      new Response(encoder, status)
    ];
    const api: AddThrow<S, C, B["_A"]> = {
      ...this.api,
      throws
    };
    return {
      ...this,
      api
    };
  }
};

export const WithQuery = {
  query: function<
    B extends Builder<unknown[], unknown>,
    P extends string,
    O = string
  >(
    this: B,
    param: UniqueQueryParam<P, B["_A"]>,
    decoder: FromQueryParam<O>
  ): Builder<
    RemoveAll<B["_C"], [{ reqHeader: unknown }]>,
    AddQueryParam<P, B["_A"], O>
  > {
    const queryParams: AddQueryParam<P, B["_A"], O> = [
      ...((this.api as any).queryParams ?? []),
      queryParam(param, decoder)
    ];
    return {
      ...this,
      api: {
        ...this.api,
        queryParams
      }
    };
  }
};

export const WithResHeader = {
  resHeader: function<
    B extends Builder<unknown[], unknown>,
    N extends string,
    V extends HeaderValue,
    O
  >(
    this: B,
    name: UniqueResHeader<N, B["_A"]>,
    encoder: ToHeaderValue<V, O>
  ): Builder<
    RemoveAll<
      B["_C"],
      [{ reqHeader: unknown }, { query: unknown }, { body: unknown }]
    >,
    AddResHeader<N, V, O, B["_A"]>
  > {
    const resHeaders = [
      ...((this.api as any).resHeaders ?? []),
      resHeader(name, encoder)
    ];
    const api: AddResHeader<N, V, O, B["_A"]> = {
      ...this.api,
      resHeaders
    };
    return {
      ...this,
      api
    };
  }
};

export const WithReqHeader = {
  reqHeader: function<
    B extends Builder<unknown[], unknown>,
    N extends string,
    V extends HeaderValue,
    O
  >(
    this: B,
    name: UniqueReqHeader<N, B["_A"]>,
    decoder: FromHeaderValue<V, O>
  ): Builder<B["_C"], AddReqHeader<N, V, O, B["_A"]>> {
    const reqHeaders = [
      ...((this.api as any).reqHeaders ?? []),
      reqHeader(name, decoder)
    ];
    const api: AddReqHeader<N, V, O, B["_A"]> = {
      ...this.api,
      reqHeaders
    };
    return {
      ...this,
      api
    };
  }
};

export const WithBody = {
  body: function<
    B extends Builder<unknown[], unknown>,
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
    B["_A"] & HasBody<D>
  > {
    const api: B["_A"] & HasBody<D> = {
      ...this.api,
      body: new RequestBody(mimeDecoder)
    };
    return {
      ...this,
      api
    };
  }
};
