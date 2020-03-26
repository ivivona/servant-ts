/* eslint-disable @typescript-eslint/no-explicit-any */
import { Either } from "fp-ts/es6/Either";
import { NotRepeating } from "./util";
import { Type, string } from "io-ts";

export type FromURLFragment<O, E = unknown> = (
  fragment: string
) => Either<E, O>;

export class Capture<F extends string, O> {
  readonly URI = "Capture";
  readonly _O!: O;
  constructor(
    readonly identifier: F,
    readonly decoder: Type<O, unknown, unknown>,
    readonly description: string = `URL parameter "${identifier}"`
  ) {}
}

export function capture<F extends string>(identifier: F): Capture<F, string>;
export function capture<F extends string, O>(
  identifier: F,
  decoder: Type<O, unknown, unknown>,
  description?: string
): Capture<F, O>;
export function capture<F extends string, O = string>(
  identifier: F,
  decoder?: Type<O, unknown, unknown>,
  description?: string
): Capture<F, O> {
  return new Capture<F, O>(
    identifier,
    decoder ?? ((string as unknown) as Type<O, unknown, unknown>),
    description
  );
}

export type UniqueCaptures<T extends Capture<string, any>[]> = NotRepeating<
  T,
  "identifier",
  "Capture identifier already in use"
>;
