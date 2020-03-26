/* eslint-disable @typescript-eslint/no-explicit-any */
import { Find } from "./util";
import { Type, string } from "io-ts";

export class QueryParam<F extends string, O> {
  readonly URI = "QueryParam";
  readonly _O!: O;
  constructor(readonly name: F, readonly decoder: Type<O, unknown, unknown>) {}
}

export function queryParam<F extends string>(name: F): QueryParam<F, string>;
export function queryParam<F extends string, O>(
  name: F,
  decoder: Type<O, unknown, unknown>
): QueryParam<F, O>;
export function queryParam<F extends string, O = string>(
  name: F,
  decoder?: Type<O, unknown, unknown>
): QueryParam<F, O> {
  return new QueryParam(
    name,
    decoder ?? ((string as unknown) as Type<O, unknown, unknown>)
  );
}

export type UniqueQueryParam<N, B extends unknown[]> = N extends string
  ? Find<QueryParam<N, unknown>, B> extends never
    ? N
    : "Query parameter already used"
  : N;
