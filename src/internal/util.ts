/* eslint-disable @typescript-eslint/no-explicit-any */
import { Either, right } from "fp-ts/es6/Either";
import { Tail, Push, Length } from "type-ts";

export const noOp = <I, E>(_: I): Either<E, I> => right(_);

type NotRepeatingAcc<A, B extends unknown[], K extends keyof B[0], C> = {
  0: A;
  n: B[0][K] extends infer V
    ? V extends C
      ? never
      : NotRepeatingAcc<A, Tail<B>, K, C | V>
    : never;
}[B extends [] ? "0" : "n"];

export type NotRepeating<
  A extends unknown[],
  K extends keyof A[0]
> = A extends [] ? A : NotRepeatingAcc<A, A, K, never>;

export type Hide<H, T> = T extends infer B & H ? B : T;

export type Remove<
  A,
  AS extends any[],
  R extends any[] = []
> = number extends Length<AS>
  ? AS
  : {
      "0": R;
      n: AS[0] extends A
        ? Remove<A, Tail<AS>, R>
        : Remove<A, Tail<AS>, Push<AS[0], R>>;
    }[AS extends [] ? "0" : "n"];

export type RemoveAll<C extends any[], M extends any[]> = number extends Length<
  M
>
  ? C
  : {
      "0": C;
      n: Remove<M[0], C> extends infer R
        ? R extends any[]
          ? RemoveAll<R, Tail<M>>
          : never
        : never;
    }[M extends [] ? "0" : "n"];
