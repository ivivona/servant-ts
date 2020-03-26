/* eslint-disable @typescript-eslint/no-explicit-any */
import * as t from "runtypes";
import { TaskEither } from "fp-ts/es6/TaskEither";
import { URIS, Kind } from "fp-ts/es6/HKT";

interface Endpoint<A extends AnyTuple> {
  readonly _A: A;
}
interface PartialEndpoint<A> {
  <B extends AnyTuple>(endpoint: Endpoint<B>): Endpoint<Cons<A, B>>;
}

type Tuple<A> = readonly A[] & { 0: A };
type AnyTuple = Tuple<any>;

type Method =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "TRACE"
  | "CONNECT"
  | "OPTIONS"
  | "HEAD"
  | "DELETE";

interface ContentType<S extends string = string> {
  readonly URI: S;
  accepts(mediaType: string): boolean;
}
class JsonC implements ContentType<"JSON"> {
  readonly URI = "JSON";
  accepts(mediaType: string): boolean {
    return /application\/json/.test(mediaType);
  }
}
const Json = new JsonC();

class Verb<M extends Method, S extends number, CS extends Tuple<ContentType>, R>
  implements Endpoint<[Verb<M, S, CS, R>]> {
  readonly _A!: [this];
  readonly _RESP!: R;
  constructor(
    readonly method: M,
    readonly status: S,
    readonly contentTypes: CS,
    readonly runtimeType: t.Runtype<R>
  ) {}
}

const GET = <CS extends Tuple<ContentType>, R>(
  contentTypes: CS,
  runtimeType: t.Runtype<R>
): Verb<"GET", 200, CS, R> => new Verb("GET", 200, contentTypes, runtimeType);

class Capture<S extends string, R> {
  readonly _ERR!: [400, "BadRequest"];
  readonly _ARG!: R;
  constructor(readonly symbol: S, readonly runtimeType: t.Runtype<R>) {}
}

function c<S extends string, R>(symbol: S, runtimeType: t.Runtype<R>) {
  return <E extends AnyTuple>(
    endpoint: Endpoint<E>
  ): Endpoint<Cons<Capture<S, R>, E>> => {
    throw "unimplemented";
  };
}

class Static<P extends string> {
  constructor(readonly path: P) {}
}

function s<S extends string>(path: S) {
  return <E extends AnyTuple>(
    endpoint: Endpoint<E>
  ): Endpoint<Cons<Static<S>, E>> => {
    throw "unimplemented";
  };
}

const _ = <S extends string>(s: S): Static<S> => new Static(s);

type Tail<T extends readonly any[]> = {
  0: never;
  1: [];
  n: ((...t: T) => void) extends (t: any, ...ts: infer TS) => void ? TS : never;
}[T extends [] ? 0 : T extends [any] ? 1 : "n"];

type Last<T extends readonly any[]> = {
  0: never;
  1: T[0];
  n: Last<Tail<T>>;
}[T extends [] ? 0 : T extends [any] ? 1 : "n"];

type Find<T, TS extends readonly any[]> = number extends TS["length"]
  ? never
  : {
      "0": never;
      n: TS[0] extends T ? TS[0] : Find<T, Tail<TS>>;
    }[TS extends [] ? "0" : "n"];

type Cons<H, T extends readonly any[]> = ((h: H, ...t: T) => void) extends (
  ...ht: infer HT
) => void
  ? HT
  : never;

type IsEmpty<A extends readonly any[]> = number extends A["length"]
  ? true
  : A["length"] extends 0
  ? true
  : false;
type TypeError<M> = { _ERROR_: M };
type UniqueCaptures<A, C = never> = A extends readonly any[]
  ? {
      zero: true;
      n: A[0] extends Capture<infer S, any>
        ? S extends C
          ? TypeError<["Duplicated capture symbol", S]>
          : UniqueCaptures<Tail<A>, C | S>
        : UniqueCaptures<Tail<A>, C>;
    }[IsEmpty<A> extends true ? "zero" : "n"]
  : TypeError<"Please use a static tuple">;

type RFlatten<A extends AnyTuple, R extends any[] = []> = {
  "0": R;
  n: A[0] extends infer H
    ? Tail<A> extends infer T
      ? T extends AnyTuple
        ? RFlatten<T, H extends AnyTuple ? RFlatten<H, R> : Cons<H, R>>
        : H extends AnyTuple
        ? RFlatten<H, R>
        : Cons<H, R>
      : H extends AnyTuple
      ? RFlatten<H, R>
      : Cons<H, R>
    : R;
}[IsEmpty<A> extends true ? "0" : "n"];
type Flatten<A extends AnyTuple> = Reverse<RFlatten<A, []>>;

const e = [
  _("users"),
  new Capture("id", t.Number),
  _("posts"),
  new Capture("id2", t.Boolean),
  GET(
    [Json],
    t.Record({
      name: t.String
    })
  )
] as const;

// Server typeclass
// Throw<E> -> TaskEither<E, A>
// Verb<any, any, A> -> TaskEither<_, A>
// Capture<any, A> -> A => _
type ErrorType<A extends readonly any[]> = {
  zero: never;
  n: "_ERR" extends keyof A[0]
    ? A[0]["_ERR"] | ErrorType<Tail<A>>
    : ErrorType<Tail<A>>;
}[IsEmpty<A> extends true ? "zero" : "n"];
type ResultType<A extends readonly any[]> = {
  zero: never;
  n: "_RESP" extends keyof A[0] ? A[0]["_RESP"] : ResultType<Tail<A>>;
}[IsEmpty<A> extends true ? "zero" : "n"];
type ArgsType<A extends readonly any[], R> = {
  zero: R;
  n: "_ARG" extends keyof A[0]
    ? (a: A[0]["_ARG"]) => ArgsType<Tail<A>, R>
    : ArgsType<Tail<A>, R>;
}[IsEmpty<A> extends true ? "zero" : "n"];
type Handler<A extends readonly any[]> = ErrorType<A> extends infer E
  ? ResultType<A> extends infer R
    ? ArgsType<A, TaskEither<E, R>>
    : never
  : never;
type h = Handler<typeof e>;

type HasResponse<A> = A extends readonly any[]
  ? Find<Verb<any, any, any, any>, A> extends never
    ? TypeError<"Verb is required">
    : true
  : TypeError<"Please use a static tuple">;

declare module "fp-ts/es6/HKT" {
  interface URItoKind<A> {
    readonly UniqueCaptures: UniqueCaptures<A>;
    readonly HasResponse: HasResponse<A>;
  }
}

declare function check<C extends URIS>(): <A extends readonly any[]>(
  api: A
) => Kind<C, A> extends true ? A : Exclude<Kind<C, A>, true>;

const x = check<"UniqueCaptures" | "HasResponse">()(e);

type Reverse<A extends readonly any[], R extends readonly any[] = []> = {
  zero: R;
  n: Reverse<Tail<A>, Cons<A[0], R>>;
}[IsEmpty<A> extends true ? "zero" : "n"];

type Request<A extends readonly any[], R extends readonly any[] = []> = {
  zero: R;
  n: Request<Tail<A>, "_REQ" extends keyof A[0] ? Cons<A[0]["_REQ"], R> : R>;
}[IsEmpty<A> extends true ? "zero" : "n"];

type rr = Reverse<Request<typeof x>>;

const y = s("users")(
  c(
    "id",
    t.Number
  )(
    GET(
      [Json],
      t.Record({
        id: t.Number,
        name: t.String
      })
    )
  )
);
