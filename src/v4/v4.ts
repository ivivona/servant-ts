import { Find, NotRepeating } from "./util";
import { Cons, Push, Head, Concat, Tail, Cast } from "type-ts";

class RuntimeType<T, URI = unknown> {
  readonly _T!: T;

  constructor(readonly URI: URI, readonly is: (x: unknown) => x is T) {}
}

const RuntimeString = new RuntimeType(
  "String" as const,
  (_: unknown): _ is string => typeof _ === "string"
);

const RuntimeNumber = new RuntimeType(
  "Number" as const,
  (_: unknown): _ is number => typeof _ === "number"
);

const t = {
  String: RuntimeString,
  Number: RuntimeNumber
};

class Capture<F extends string, O> {
  static readonly URI = "Capture" as const;
  constructor(readonly identifier: F, readonly type: RuntimeType<O>) {}
}

export type UniqueCaptures<T extends Capture<string, any>[]> = NotRepeating<
  T,
  "identifier",
  "Capture identifier already in use"
>;

type f = UniqueCaptures<[Capture<"id", string>, Capture<"id", number>]>;

declare function int<I extends string>(id: I): Capture<I, number>;

declare function regex<I extends string>(
  regex: RegExp,
  id: I
): Capture<I, string>;

class API<A extends unknown[]> {
  readonly _A!: A;
  append<B>(b: B): API<Cons<B, A>> {
    throw 1;
  }
}

interface Builder<A> {
  <B>(ab: (a: A) => B): B;
  <B, C>(ab: (a: A) => B, bc: (b: B) => C): C;
  <B, C, D>(ab: (a: A) => B, bc: (b: B) => C, cd: (c: C) => D): D;
  <B, C, D, E>(
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E
  ): E;
  <B, C, D, E, F>(
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F
  ): F;
  <B, C, D, E, F, G>(
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G
  ): G;
  <B, C, D, E, F, G, H>(
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H
  ): H;
  <B, C, D, E, F, G, H, I>(
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I
  ): I;
  <B, C, D, E, F, G, H, I, J>(
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J
  ): J;
  <B, C, D, E, F, G, H, I, J, K>(
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J,
    jk: (j: J) => K
  ): K;
  <B, C, D, E, F, G, H, I, J, K, L>(
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J,
    jk: (j: J) => K,
    kl: (k: K) => L
  ): L;
  <B, C, D, E, F, G, H, I, J, K, L, M>(
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J,
    jk: (j: J) => K,
    kl: (k: K) => L,
    lm: (l: L) => M
  ): M;
  <B, C, D, E, F, G, H, I, J, K, L, M, N>(
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J,
    jk: (j: J) => K,
    kl: (k: K) => L,
    lm: (l: L) => M,
    mn: (m: M) => N
  ): N;
  <B, C, D, E, F, G, H, I, J, K, L, M, N, O>(
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J,
    jk: (j: J) => K,
    kl: (k: K) => L,
    lm: (l: L) => M,
    mn: (m: M) => N,
    no: (n: N) => O
  ): O;
  <B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>(
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J,
    jk: (j: J) => K,
    kl: (k: K) => L,
    lm: (l: L) => M,
    mn: (m: M) => N,
    no: (n: N) => O,
    op: (o: O) => P
  ): P;
  <B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q>(
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H,
    hi: (h: H) => I,
    ij: (i: I) => J,
    jk: (j: J) => K,
    kl: (k: K) => L,
    lm: (l: L) => M,
    mn: (m: M) => N,
    no: (n: N) => O,
    op: (o: O) => P,
    pq: (p: P) => Q
  ): Q;
}

declare function POST<T extends Capture<string, any>[]>(
  fragments: TemplateStringsArray,
  ...captures: UniqueCaptures<T>
): Builder<API<Cons<"POST", typeof captures>>>;

type BeforeResponse<A extends unknown[]> = Find<
  Response<any[], unknown, unknown>,
  A
> extends never
  ? true
  : false;

type BeforeQueryParam<A extends unknown[]> = Find<
  QueryParam<any, unknown>,
  A
> extends never
  ? true
  : false;

type BeforeResHeader<A extends unknown[]> = Find<
  ResHeader<any, unknown>,
  A
> extends never
  ? true
  : false;

type BeforeReqBody<A extends unknown[]> = Find<
  ReqBody<any[], unknown>,
  A
> extends never
  ? true
  : false;

class QueryParam<ID extends string, O> {
  readonly URI = "QueryParam";
  constructor(readonly identifier: ID, readonly runtimeType: O) {}
}
type UniqueQueryParam<N, B> = B extends unknown[]
  ? N extends string
    ? Find<QueryParam<N, unknown>, B> extends never
      ? true
      : false
    : true
  : true;
declare function queryParam<I extends string, O, A extends unknown[]>(
  id: UniqueQueryParam<I, A> extends true
    ? I
    : "Query parameter already in use",
  runtimeType: RuntimeType<O>
): (
  a: BeforeResponse<A> extends true
    ? BeforeResHeader<A> extends true
      ? BeforeReqBody<A> extends true
        ? API<A>
        : "QueryParam must be used before ReqBody"
      : "QueryParam must be used before ResHeader"
    : "QueryParam must be used before Response"
) => API<Push<QueryParam<I, O>, A>>;

class MimeType<I extends string = string> {
  readonly URI = "MimeType";
  constructor(readonly identifier: I) {}
}
const JSON = new MimeType("JSON");
const URLFormEncoded = new MimeType("URLFormEncoded");

class Response<MT extends MimeType[], T, S> {
  readonly URI = "Response";
  constructor(
    readonly mimeType: MT,
    readonly runtimeType: T,
    readonly status: S
  ) {}
}
declare function response<
  MT extends MimeType[],
  T,
  S extends number,
  A extends unknown[]
>(
  mimeType: MT,
  runtimeType: RuntimeType<T>,
  status: S
): (a: API<A>) => API<Push<Response<MT, T, S>, A>>;

class ReqBody<MT extends MimeType[], T> {
  readonly URI = "ReqBody";
  constructor(readonly mimeType: MT, readonly runtimeType: T) {}
}
declare function reqBody<MT extends MimeType[], T, A extends unknown[]>(
  mimeType: MT,
  runtimeType: RuntimeType<T>
): (
  a: BeforeResponse<A> extends true
    ? BeforeResHeader<A> extends true
      ? API<A>
      : "ReqBody must be used before ResHeader"
    : "ReqBody must be used before Response"
) => API<Push<ReqBody<MT, T>, A>>;

class ReqHeader<ID extends string, O> {
  readonly URI = "ReqHeader";
  constructor(readonly identifier: ID, readonly runtimeType: O) {}
}
type UniqueReqHeader<N, B> = B extends unknown[]
  ? N extends string
    ? Find<ReqHeader<N, unknown>, B> extends never
      ? true
      : false
    : true
  : true;
declare function reqHeader<I extends string, O, A extends unknown[]>(
  id: UniqueReqHeader<I, A> extends true
    ? I
    : "ReqHeader identifier already in use",
  runtimeType: RuntimeType<O>
): (
  a: BeforeResponse<A> extends true
    ? BeforeResHeader<A> extends true
      ? BeforeReqBody<A> extends true
        ? BeforeQueryParam<A> extends true
          ? API<A>
          : "ReqHeader must be used before QueryParam"
        : "QueryParam must be used before ReqBody"
      : "ReqHeader must be used before ResHeader"
    : "ReqHeader must be used before Response"
) => API<Push<ReqHeader<I, O>, A>>;

class ResHeader<ID extends string, O> {
  readonly URI = "ResHeader";
  constructor(readonly identifier: ID, readonly runtimeType: O) {}
}
type UniqueResHeader<N, B> = B extends unknown[]
  ? N extends string
    ? Find<ResHeader<N, unknown>, B> extends never
      ? true
      : false
    : true
  : true;
declare function resHeader<I extends string, O, A extends unknown[]>(
  id: UniqueResHeader<I, A> extends true
    ? I
    : "ResHeader identifier already in use",
  runtimeType: RuntimeType<O>
): (
  a: BeforeResponse<A> extends true
    ? API<A>
    : "ResHeader must be used before Response"
) => API<Push<ResHeader<I, O>, A>>;

interface Choice<A, B> {
  URI: "Choice";
  _A: A;
  _B: B;
}
type AnyTuple = (Array<any> & { "0": any }) | [];
type IsEmpty<A extends AnyTuple> = A["length"] extends 0 ? true : false;
type Flatten<A extends AnyTuple, R extends any[] = []> = {
  "0": R;
  n: Head<A> extends infer H
    ? Tail<A> extends infer T
      ? T extends AnyTuple
        ? Flatten<T, H extends AnyTuple ? Flatten<H, R> : Push<H, R>>
        : H extends AnyTuple
        ? Flatten<H, R>
        : Push<H, R>
      : H extends AnyTuple
      ? Flatten<H, R>
      : Push<H, R>
    : R;
}[IsEmpty<A> extends true ? "0" : "n"];
type flat = Flatten<[[[1], 2, [3]], 2, [[3, 4], 5]]>;

type Naked<A extends API<unknown[]>[]> = {
  "0": [];
  n: Push<Head<A>["_A"], Naked<Tail<A>>>;
}[A["length"] extends 0 ? "0" : number extends A["length"] ? "0" : "n"];
interface Nested<A extends API<unknown[]>> {
  readonly URI: "Nested";
  readonly _A: A;
}
declare function nested<A extends API<unknown[]>[], B>(
  ...subApi: A
): (b: B) => API<Naked<A>>;

const api = POST`/users/${int("id")}/posts/${regex(/\w/, "slug")}`(
  reqHeader("Authorization", t.String),
  reqHeader("X-From", t.Number),
  queryParam("aa", t.String),
  queryParam("aa2", t.String),
  reqBody([JSON, URLFormEncoded], t.String),
  resHeader("aaa", t.String),
  resHeader("aa", t.Number),
  response([JSON], t.Number, 200)
  // Authorized(),
  // Throw(Json, t.type({ err: t.string }), 402),
);

// _(
//   Path("users"),
//   Int("id")
//   Path("posts"),
//   Regex(/\w/, "slug")
//   QueryParam("aa", t.String),
//   QueryParam("aa2", t.String),
//   Response("JSON", t.Number, 200)
// )

// API("users")(Int("id"))("posts")(Regex(/\w/, "slug"))(Choice([], []));
