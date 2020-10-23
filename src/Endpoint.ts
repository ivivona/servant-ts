import { AnyTuple, Cons } from "type-ts";
import { cons } from "./util";

export interface Endpoint<CS extends AnyTuple = AnyTuple> {
  readonly combinators: CS;
}

export class Append<C, E extends Endpoint>
  implements Endpoint<Cons<C, E["combinators"]>> {
  readonly combinators: Cons<C, E["combinators"]>;
  constructor(readonly head: C, readonly rest: E["combinators"]) {
    this.combinators = cons(head, rest);
  }
}

export interface PartialEndpoint<A = never> {
  append<E extends AnyTuple>(endpoint: Endpoint<E> | A): Append<this, Endpoint<E>>;
}
