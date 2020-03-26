import { Tail, Length } from "type-ts";

export type Find<T, TS extends any[]> = number extends Length<TS>
  ? never
  : {
      "0": never;
      n: TS[0] extends T ? TS[0] : Find<T, Tail<TS>>;
    }[TS extends [] ? "0" : "n"];

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
