import { Either } from "fp-ts/es6/Either";
import { noOp, NotRepeating } from "./util";

export type FromURLFragment<O, E = unknown> = (
  fragment: string
) => Either<E, O>;

export class Capture<F extends string, O> {
  readonly _O!: O;
  constructor(
    readonly identifier: F,
    readonly decoder: FromURLFragment<O>,
    readonly description: string = `URL parameter "${identifier}"`
  ) {}
}

export function capture<F extends string>(identifier: F): Capture<F, string>;
export function capture<F extends string, O>(
  identifier: F,
  decoder: FromURLFragment<O>,
  description?: string
): Capture<F, O>;
export function capture<F extends string, O = string>(
  identifier: F,
  decoder?: FromURLFragment<O>,
  description?: string
): Capture<F, O> {
  return new Capture(
    identifier,
    decoder ?? (noOp as FromURLFragment<O>),
    description
  );
}

export interface HasCaptures<C extends Capture<string, unknown>[]> {
  readonly captures: C;
}

export type UniqueCaptures<T extends Capture<string, unknown>[]> = NotRepeating<
  T,
  "identifier"
>;
