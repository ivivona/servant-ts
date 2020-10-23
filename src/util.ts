/* eslint-disable @typescript-eslint/no-explicit-any */
import { Concat, AnyStaticArray, Flatten, StaticArray, Cons } from "type-ts";
import { Capture } from "./Capture";

export function concat<A extends AnyStaticArray, B extends AnyStaticArray>(
  a: A,
  b: B
): Concat<A, B> {
  return ([...a, ...b] as any) as Concat<A, B>;
}

export function flatten<A extends AnyStaticArray>(a: A): Flatten<A> {
  return (a.flat(Infinity) as any) as Flatten<A>;
}

export function cons<H, T extends AnyStaticArray>(
  head: H,
  tail: T
): Cons<H, T> {
  return ([head, ...tail] as any) as Cons<H, T>;
}
