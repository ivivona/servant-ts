/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tail, Reverse, Length, Equals, Cons } from "type-ts";

type NotRepeatingAcc<A, B extends unknown[], K extends keyof B[0], C, Err> = {
  0: A;
  n: B[0][K] extends infer V
    ? V extends C
      ? Err & []
      : NotRepeatingAcc<A, Tail<B>, K, C | V, Err>
    : Err & [];
}[B extends [] ? "0" : "n"];

export type NotRepeating<
  A extends unknown[],
  K extends keyof A[0],
  Err = "Repeated key"
> = A extends [] ? A : NotRepeatingAcc<A, A, K, never, Err>;

export type Hide<H, T> = T extends infer B & H ? B : T;

type RemoveAcc<A, AS extends any[], R extends any[]> = {
  "0": R;
  n: AS[0] extends A
    ? RemoveAcc<A, Tail<AS>, R>
    : R extends infer RI
    ? Equals<number, RI> extends false
      ? RemoveAcc<A, Tail<AS>, Cons<AS[0], R>>
      : R
    : R;
}[AS extends [] ? "0" : "n"];

export type Remove<A, AS extends any[]> = AS;
// export type Remove<A, AS extends any[]> = Equals<
//   number,
//   Length<AS>
// > extends true
//   ? AS
//   : RemoveAcc<A, AS, []> extends infer R
//   ? Reverse<Cast<R, any[]>>
//   : AS;

export type RemoveAll<C extends any[], M extends any[]> = C;
// export type RemoveAll<C extends any[], M extends any[]> = Equals<
//   number,
//   Length<M>
// > extends true
//   ? C
//   : {
//       "0": C;
//       n: Equals<number, Length<M>> extends false
//         ? Remove<M[0], C> extends infer R
//           ? R extends any[]
//             ? RemoveAll<R, Tail<M>>
//             : C
//           : C
//         : C;
//     }[M extends [] ? "0" : "n"];

export type Find<T, TS extends unknown[]> = number extends Length<TS>
  ? never
  : {
      "0": never;
      n: TS[0] extends T ? TS[0] : Find<T, Tail<TS>>;
    }[TS extends [] ? "0" : "n"];

export type SafePush<A, AS extends unknown[]> = Equals<
  number,
  Length<AS>
> extends false
  ? Reverse<AS> extends infer SA
    ? SA extends any[]
      ? Cons<A, SA> extends infer ASA
        ? ASA extends any[]
          ? Reverse<ASA>
          : never
        : never
      : never
    : never
  : never;
