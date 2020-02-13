import { Either } from "fp-ts/es6/Either";
import { noOp, Hide, NotRepeating } from "./util";
import { Push } from "type-ts";

export type FromQueryParam<O, E = unknown> = (param: string) => Either<E, O>;

export class QueryParam<F extends string, O> {
  readonly _O!: O;
  constructor(readonly name: F, readonly decoder: FromQueryParam<O>) {}
}

export class QueryParams<F extends string, O> {
  readonly _O!: O;
  constructor(readonly name: F, readonly decoder: FromQueryParam<O>) {}
}

export function queryParam<F extends string>(name: F): QueryParam<F, string>;
export function queryParam<F extends string, O>(
  name: F,
  decoder: FromQueryParam<O>
): QueryParam<F, O>;
export function queryParam<F extends string, O = string>(
  name: F,
  decoder?: FromQueryParam<O>
): QueryParam<F, O> {
  return new QueryParam(name, decoder ?? (noOp as FromQueryParam<O>));
}

export function queryParams<F extends string>(name: F): QueryParams<F, string>;
export function queryParams<F extends string, O>(
  name: F,
  decoder: FromQueryParam<O>
): QueryParams<F, O>;
export function queryParams<F extends string, O = string>(
  name: F,
  decoder?: FromQueryParam<O>
): QueryParams<F, O> {
  return new QueryParams(name, decoder ?? (noOp as FromQueryParam<O>));
}

export interface HasQueryParams<P extends QueryParam<string, unknown>[]> {
  readonly queryParams: P;
}

export type AddQueryParam<
  N extends string,
  B,
  O = string
> = B extends HasQueryParams<infer H>
  ? Hide<HasQueryParams<H>, B> & HasQueryParams<Push<QueryParam<N, O>, H>>
  : B & HasQueryParams<[QueryParam<N, O>]>;

export type UniqueQueryParam<N, B> = N extends string
  ? B extends HasQueryParams<infer H>
    ? NotRepeating<Push<{ name: N }, H>, "name"> extends never
      ? "Query parameter already used"
      : N
    : N
  : N;
