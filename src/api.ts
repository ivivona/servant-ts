import { UniqueCaptures, Capture } from "./Capture";
import { AnyStaticArray, AnyTuple } from "type-ts";
import { Static } from "./Static";
import { Runtype } from "runtypes";

export interface Constraints<A> {
  readonly UniqueCaptures: A extends AnyStaticArray ? UniqueCaptures<A> : never;
}

export type CheckConstraint<A, C extends keyof Constraints<A>> = Constraints<
  A
>[C] extends true
  ? A
  : Exclude<Constraints<A>[C], true>;

export function define<C extends keyof Constraints<unknown>>(): <
  A extends AnyTuple
>(
  api: A
) => CheckConstraint<A, C> {
  throw new Error("unimplemented");
}

export function _<S extends string>(s: S): Static<S>;
export function _<S extends string, R>(
  s: S,
  runtimeType: Runtype<R>
): Capture<S, R>;
export function _<S extends string, R>(
  s: S,
  runtimeType?: Runtype<R>
): Static<S> | Capture<S, R> {
  if (runtimeType) {
    return new Capture(s, runtimeType);
  }
  return new Static(s);
}
