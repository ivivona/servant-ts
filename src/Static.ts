import { PartialEndpoint, Endpoint, Append } from "./Endpoint";
import { Cons } from "type-ts";

export class Static<P extends string> implements PartialEndpoint {
  constructor(readonly path: P) {}
  append<E extends Endpoint>(e: E): Endpoint<Cons<this, E["combinators"]>> {
    return new Append(this, e.combinators);
  }
}
