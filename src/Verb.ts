import { Method } from "./Http";
import { Tuple } from "type-ts";
import { ContentType } from "./ContentType";
import { Runtype } from "runtypes";
import { OK } from "http-status-codes";
import { Endpoint } from "./Endpoint";

export class Verb<
  M extends Method,
  S extends number,
  CS extends Tuple<ContentType>,
  R
> implements Endpoint<[Verb<M, S, CS, R>]> {
  readonly combinators: [Verb<M, S, CS, R>] = [this];
  constructor(
    readonly method: M,
    readonly status: S,
    readonly contentTypes: CS,
    readonly runtimeType: Runtype<R>
  ) {}
}

export const GET = <CS extends Tuple<ContentType>, R>(
  contentTypes: CS,
  runtimeType: Runtype<R>
): Verb<"GET", typeof OK, CS, R> =>
  new Verb("GET", OK, contentTypes, runtimeType);
