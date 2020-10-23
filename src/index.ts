import * as t from "runtypes";
import { _1, _2, _3, _4, _9 } from "type-ts";
import { Json } from "./ContentType";
import { GET } from "./Verb";
import { _ } from "./api";
import { PartialEndpoint, Endpoint, Append } from "./Endpoint";

const User = t.Record({
  id: t.Number,
  name: t.String,
});
type User = t.Static<typeof User>;
const e = [
  _("users"),
  _("id", t.Number),
  _("posts"),
  _("id2", t.String),
  GET([Json], User),
] as const;

function pipe(a: PartialEndpoint, b: Endpoint): Append<typeof a, typeof b> {
  return a.append(b);
}

const x = pipe(
  _("users"),
  GET([Json], User)
)

const g = GET([Json], User);
const p = _("id2", t.String).append(g);
const p2 = _("posts").append(p);
const i = _("id", t.Number).append(p2);
const a1 = _("users").append(i);
type a1 = typeof a1;
type c2 = a1["combinators"];
// const a = api(e);

// interface HasLayout {
//   layout(): string;
// }

// interface ToPath {
//   toPath(): string;
// }

// declare module "./Static" {
//   interface Static<P extends string> {
//     layout(): string;
//     toPath(): string;
//   }
// }
// Static.prototype.layout = function (): string {
//   return this.path;
// };
// Static.prototype.toPath = function (): string {
//   return this.path;
// };

// declare module "./Capture" {
//   interface Capture<S extends string, R> {
//     layout(): string;
//     toPath(): string;
//   }
// }
// Capture.prototype.layout = function (): string {
//   return `${this.symbol}@${this.runtimeType.reflect.tag}`;
// };
// Capture.prototype.toPath = function (): string {
//   return `:${this.symbol}`;
// };

// declare module "./Verb" {
//   interface Verb<
//     M extends Method,
//     S extends number,
//     CS extends Tuple<ContentType>,
//     R
//   > {
//     layout(): string;
//     toJSON(): string;
//   }
// }
// Verb.prototype.layout = function (
//   this: Verb<Method, number, Tuple<ContentType>, unknown>
// ): string {
//   return `${this.method} (${this.status}): ${this.contentTypes} ${this.runtimeType.reflect.tag}`;
// };
// Verb.prototype.toJSON = function () {
//   return `${this.method}`;
// };

// function hasLayout(c: unknown): c is HasLayout {
//   return !!(c as any)?.layout;
// }

// function isPath(c: unknown): c is ToPath {
//   return !!(c as any)?.toPath;
// }

// function layout<A extends AnyTuple>(a: A): void {
//   for (const c of a) {
//     if (hasLayout(c)) {
//       console.log(c.layout());
//     } else {
//       console.log(c);
//     }
//   }
// }

// function toPath<A extends AnyTuple>(a: A): string {
//   return a
//     .filter((_) => isPath(_))
//     .map((c) => {
//       assert(isPath(c));
//       return c.toPath();
//     })
//     .join("/");
// }

// // layout(e);
// console.log(toPath(e));

// declare module "type-ts/src/list" {
//   interface Map1<A = unknown> {
//     Id: A;
//     AsNat: A extends number ? AsNat<A> : never;
//   }
//   interface Reduce2<A = unknown, B = unknown> {
//     Add: A extends Nat ? (B extends Nat ? Add<A, B> : never) : never;
//   }
// }

// type m = Map<[1, 2, 3], "AsNat">;
// type r = Equals<Reduce<m, "Add", _4>, Add<_1, _9>>;
(function () {
  const first: any[] = [];
  let aaa: any[] = first;
  function _(a: any, t?: any): typeof _ {
    const x: any[] = [];
    if (t) {
      aaa.push(a, t, x);
    } else {
      aaa.push(a, x);
    }
    aaa = x;
    return _;
  }
  _("users")("id", 123)([
    _("posts")("id2", 123)(GET([Json], User)),
    _("posts")("id2", 123)(GET([Json], User)),
  ]);
  console.log(first);
})();

// Int -> Int -> TaskEither<HttpErr, User>
// User -> String
// Promise<User> -> String
// Promise<User> -> Promise<String>

// interface Endpoint<R> {
//   readonly URI: "Endpoint";
//   readonly R: R;
// }

// interface PartialEndpoint {
//   readonly URI: "PartialEndpoint";
//   append<E>(e: Endpoint<unknown>): Endpoint<unknown>;
// }

// class Append<P extends PartialEndpoint, E extends Endpoint<unknown>>
//   implements Endpoint<unknown> {
//   readonly URI!: "Endpoint";
//   readonly R!: [P, E["R"]];
//   constructor(readonly head: P, readonly tail: E) {}
// }

// class V<A> implements Endpoint<V<A>> {
//   readonly URI!: "Endpoint";
//   readonly R!: V<A>;
// }

// class C<S extends string> implements PartialEndpoint {
//   readonly URI!: "PartialEndpoint";
//   append<E extends Endpoint<unknown>>(e: E): Append<this, E> {
//     return new Append(this, e);
//   }
// }

// const tt = new C<"2">().append(new C<"1">().append(new V<"3">()));
// type tt = typeof tt;
// type tr = tt["R"];

// const y = s("users")(
//   c(
//     "id",
//     t.Number
//   )(
//     s("posts")(
//       c(
//         "id2",
//         t.Boolean
//       )(
//         GET(
//           [Json],
//           t.Record({
//             id: t.Number,
//             name: t.String
//           })
//         )
//       )
//     )
//   )
// );

// Server typeclass
// Throw<E> -> TaskEither<E, A>
// Verb<any, any, A> -> TaskEither<_, A>
// Capture<any, A> -> A => _
// type ErrorType<A extends AnyStaticArray> = {
//   zero: never;
//   n: "_ERR" extends keyof A[0]
//     ? A[0]["_ERR"] | ErrorType<Tail<A>>
//     : ErrorType<Tail<A>>;
// }[IsEmpty<A> extends true ? "zero" : "n"];
// type ResultType<A extends AnyStaticArray> = {
//   zero: never;
//   n: "_RESP" extends keyof A[0] ? A[0]["_RESP"] : ResultType<Tail<A>>;
// }[IsEmpty<A> extends true ? "zero" : "n"];
// type ArgsType<A extends AnyStaticArray, R> = {
//   zero: R;
//   n: "_ARG" extends keyof A[0]
//     ? (a: A[0]["_ARG"]) => ArgsType<Tail<A>, R>
//     : ArgsType<Tail<A>, R>;
// }[IsEmpty<A> extends true ? "zero" : "n"];
// type Handler<A extends AnyStaticArray> = ErrorType<A> extends infer E
//   ? ResultType<A> extends infer R
//     ? ArgsType<A, TaskEither<E, R>>
//     : never
//   : never;
// type h = Handler<typeof e>;

// type HasResponse<A> = A extends AnyStaticArray
//   ? Find<Verb<any, any, any, any>, A> extends never
//     ? TypeError<"Verb is required">
//     : true
//   : TypeError<"Please use a static tuple">;

// declare module "fp-ts/es6/HKT" {
//   interface URItoKind<A> {
//     readonly UniqueCaptures: UniqueCaptures<A>;
//     readonly HasResponse: HasResponse<A>;
//   }
// }

// declare function check<C extends URIS>(): <A extends AnyStaticArray>(
//   api: A
// ) => Kind<C, A> extends true ? A : Exclude<Kind<C, A>, true>;

// const x = check<"UniqueCaptures" | "HasResponse">()(e);

// type Reverse<A extends AnyStaticArray, R extends AnyStaticArray = []> = {
//   zero: R;
//   n: Reverse<Tail<A>, Cons<A[0], R>>;
// }[IsEmpty<A> extends true ? "zero" : "n"];

// type Request<A extends AnyStaticArray, R extends AnyStaticArray = []> = {
//   zero: R;
//   n: Request<Tail<A>, "_REQ" extends keyof A[0] ? Cons<A[0]["_REQ"], R> : R>;
// }[IsEmpty<A> extends true ? "zero" : "n"];

// type rr = Reverse<Request<typeof x>>;

// interface JsonC {
//   fromHttp(): string;
// }

// JsonC.prototype.fromHttp = () => "";
