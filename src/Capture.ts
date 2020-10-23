/* eslint-disable @typescript-eslint/no-explicit-any */
import { Runtype } from "runtypes";
import { AnyStaticArray, Tail, Head, AnyTuple, Nil, Cons } from "type-ts";
import { TypeError } from "./TypeError";
import { PartialEndpoint, Endpoint, Append } from "./Endpoint";

export class Capture<S extends string, R> implements PartialEndpoint<TypeError> {
  readonly URI!: "Capture";
  constructor(readonly symbol: S, readonly runtimeType: Runtype<R>) {}
  append<E extends AnyTuple>(
    e: UniqueCaptures<E, S>
  ): Append<this, Endpoint<E>> {
    return new Append(this, (e as any as Endpoint<E>).combinators);
  }
}

type UniqueCapturesHelp<A extends AnyStaticArray, C> = {
  zero: true;
  n: A extends AnyTuple
    ? Head<A> extends Capture<infer S, any>
      ? S extends C
        ? TypeError<["Duplicated Capture symbol", S]>
        : UniqueCapturesHelp<Tail<A>, C | S>
      : UniqueCapturesHelp<Tail<A>, C>
    : TypeError<"StaticArray expected as input">;
}[A extends Nil ? "zero" : "n"];

export type UniqueCaptures<A extends AnyTuple, C> = UniqueCapturesHelp<A, C> extends infer R
      ? R extends true
        ? Endpoint<A>
        : R extends TypeError
          ? R
          : TypeError<"Invalid endpoint">
      : TypeError<"Invalid endpoint">;
