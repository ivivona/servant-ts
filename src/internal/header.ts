/* eslint-disable @typescript-eslint/no-explicit-any */
import { identity } from "fp-ts/es6/function";
import { Hide, NotRepeating } from "./util";
import { Push } from "type-ts";

export type HeaderValue = undefined | number | string | string[];
export type FromHeaderValue<I extends HeaderValue, O = I> = (param: I) => O;
export type ToHeaderValue<I, O extends HeaderValue> = (param: I) => O;

export class ReqHeader<F extends string, I extends HeaderValue, O> {
  readonly _I!: I;
  readonly _O!: O;
  constructor(readonly name: F, readonly decoder: FromHeaderValue<I, O>) {}
}

export class ResHeader<F extends string, O extends HeaderValue, I = unknown> {
  readonly _I!: I;
  readonly _O!: O;
  constructor(readonly name: F, readonly decoder: ToHeaderValue<I, O>) {}
}

export function reqHeader<F extends string>(
  name: F
): ReqHeader<F, HeaderValue, HeaderValue>;
export function reqHeader<F extends string, I extends HeaderValue, O>(
  name: F,
  decoder: FromHeaderValue<I, O>
): ReqHeader<F, I, O>;
export function reqHeader<F extends string, I extends HeaderValue, O = I>(
  name: F,
  decoder?: FromHeaderValue<I, O>
): ReqHeader<F, I, O> {
  return new ReqHeader(name, decoder ?? (identity as FromHeaderValue<I, O>));
}

export function resHeader<F extends string>(
  name: F
): ResHeader<F, string, string>;
export function resHeader<F extends string, I, O extends HeaderValue>(
  name: F,
  decoder: ToHeaderValue<I, O>
): ResHeader<F, O, I>;
export function resHeader<
  F extends string,
  I = string,
  O extends HeaderValue = string
>(name: F, decoder?: ToHeaderValue<I, O>): ResHeader<F, O, I> {
  return new ResHeader(name, decoder ?? (identity as ToHeaderValue<I, O>));
}

export interface HasReqHeaders<
  H extends ReqHeader<string, HeaderValue, unknown>[]
> {
  readonly reqHeaders: H;
}

export interface HasResHeaders<
  H extends ResHeader<string, HeaderValue, any>[]
> {
  readonly resHeaders: H;
}

export type AddReqHeader<
  N extends string,
  V extends HeaderValue,
  O,
  B
> = B extends HasReqHeaders<infer H>
  ? Hide<HasReqHeaders<H>, B> & HasReqHeaders<Push<ReqHeader<N, V, O>, H>>
  : B & HasReqHeaders<[ReqHeader<N, V | HeaderValue, O>]>;

export type UniqueReqHeader<N, B> = N extends string
  ? B extends HasReqHeaders<infer H>
    ? NotRepeating<Push<{ name: N }, H>, "name"> extends never
      ? "Request header already declared"
      : N
    : N
  : N;

export type AddResHeader<
  N extends string,
  V extends HeaderValue,
  I,
  B
> = B extends HasResHeaders<infer H>
  ? Hide<HasResHeaders<H>, B> & HasResHeaders<Push<ResHeader<N, V, I>, H>>
  : B & HasResHeaders<[ResHeader<N, V, I>]>;

export type UniqueResHeader<N, B> = N extends string
  ? B extends HasResHeaders<infer H>
    ? NotRepeating<Push<{ name: N }, H>, "name"> extends never
      ? "Response header already declared"
      : N
    : N
  : N;
