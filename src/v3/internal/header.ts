/* eslint-disable @typescript-eslint/no-explicit-any */
import { Find } from "./util";
import { Type, string } from "io-ts";

export class ReqHeader<F extends string, O> {
  readonly URI = "ReqHeader";
  readonly _O!: O;
  constructor(readonly name: F, readonly decoder: Type<O, unknown, unknown>) {}
}

export class ResHeader<F extends string, I> {
  readonly URI = "ResHeader";
  readonly _I!: I;
  constructor(readonly name: F, readonly decoder: Type<I, unknown, unknown>) {}
}

export function reqHeader<F extends string>(name: F): ReqHeader<F, string>;
export function reqHeader<F extends string, O>(
  name: F,
  decoder: Type<O, unknown, unknown>
): ReqHeader<F, O>;
export function reqHeader<F extends string, O = string>(
  name: F,
  decoder?: Type<O, unknown, unknown>
): ReqHeader<F, O> {
  return new ReqHeader(
    name,
    decoder ?? ((string as unknown) as Type<O, unknown, unknown>)
  );
}

export function resHeader<F extends string>(name: F): ResHeader<F, string>;
export function resHeader<F extends string, I>(
  name: F,
  decoder: Type<I, unknown, unknown>
): ResHeader<F, I>;
export function resHeader<F extends string, I = string>(
  name: F,
  decoder?: Type<I, unknown, unknown>
): ResHeader<F, I> {
  return new ResHeader(
    name,
    decoder ?? ((string as unknown) as Type<I, unknown, unknown>)
  );
}

export type UniqueReqHeader<N, B extends unknown[]> = N extends string
  ? Find<ReqHeader<N, any>, B> extends never
    ? N
    : "Request header already declared"
  : N;

export type UniqueResHeader<N, B extends unknown[]> = N extends string
  ? Find<ResHeader<N, any>, B> extends never
    ? N
    : "Response header already declared"
  : N;
