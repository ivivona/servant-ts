/* eslint-disable @typescript-eslint/no-explicit-any */
// import { Push, Cast } from "type-ts";
// import { NotRepeating, Hide } from "./internal/util";
// import { Capture, HasCaptures } from "./internal/capture";
// import {
//   StatusCode,
//   HTTPMethod,
//   HasURLPath,
//   HasHTTPMethod
// } from "./internal/http";
// import { MimeType, MimeDecoder, MimeEncoder } from "./internal/mimeType";
// import {
//   QueryParam,
//   FromQueryParam,
//   queryParam,
//   HasQueryParams,
//   AddQueryParam,
//   UniqueQueryParam
// } from "./internal/queryParam";
// import { Response } from "./internal/response";
// import {
//   ReqHeader,
//   HasReqHeaders,
//   HasResHeaders,
//   ResHeader,
//   UniqueResHeader,
//   HeaderValue,
//   AddResHeader,
//   ToHeaderValue,
//   resHeader,
//   UniqueReqHeader,
//   AddReqHeader,
//   FromHeaderValue,
//   reqHeader
// } from "./internal/header";

// export type AddResponse<
//   S extends StatusCode,
//   M extends MimeEncoder<any, any>,
//   B
// > = B extends HasResponses<infer H>
//   ? Hide<HasResponses<H>, B> & HasResponses<Push<Response<M, S>, H>>
//   : B & HasResponses<[Response<M, S>]>;

// export type UniqueStatusCode<S, B> = S extends StatusCode
//   ? B extends HasResponses<infer H>
//     ? NotRepeating<Push<{ status: S }, H>, "status"> extends never
//       ? never
//       : S
//     : S
//   : never;

// export interface HasResponses<R extends Response<any, any>[]> {
//   readonly responses: R;
// }

// export interface EndpointDefinition
//   extends HasURLPath,
//     HasCaptures<Capture<any, any>[]>,
//     HasHTTPMethod<HTTPMethod>,
//     HasReqHeaders<ReqHeader<any, any, any>[]>,
//     HasQueryParams<QueryParam<string, any>[]>,
//     HasBody<MimeDecoder<any, any>>,
//     HasResHeaders<ResHeader<any, any, any>[]>,
//     HasResponses<Response<MimeEncoder<any, any>, StatusCode>[]> {}

// export interface Builder<E> {
//   readonly endpoint: E;
// }

// export type NoBody<
//   T extends Builder<any>,
//   M extends HTTPMethod
// > = T["endpoint"] extends HasHTTPMethod<M> ? Omit<T, "body"> : T;

// class BuildResponse<E extends Partial<EndpointDefinition>>
//   implements Builder<E> {
//   constructor(readonly endpoint: E) {}

//   response<C extends MimeEncoder<any, any>>(
//     this: UniqueStatusCode<200, E> extends infer S
//       ? S extends StatusCode
//         ? BuildResponse<E>
//         : never
//       : never,
//     encoder: C
//   ): BuildResponse<AddResponse<UniqueStatusCode<200, E>, C, E>>;
//   response<C extends MimeEncoder<any, any>, S extends StatusCode>(
//     encoder: C,
//     status: UniqueStatusCode<S, E>
//   ): BuildResponse<AddResponse<S, C, E>>;
//   response<C extends MimeEncoder<any, any>, S extends StatusCode = 200>(
//     encoder: C,
//     status?: UniqueStatusCode<S, E>
//   ): BuildResponse<AddResponse<S, C, E>> {
//     const { responses, ...noResponses } = this.endpoint;
//     const newStatus = (status as StatusCode) ?? (200 as StatusCode);
//     if (responses?.find(_ => _.status === status)) {
//       throw new Error(`Response with status [${status}] already specified`);
//     }
//     const newResponses: Response<MimeEncoder<any, any>, StatusCode>[] = [
//       ...(responses ?? []),
//       new Response(encoder, newStatus)
//     ];
//     const newEndpoint = {
//       ...noResponses,
//       responses: newResponses
//     } as AddResponse<S, C, E>;
//     return new BuildResponse<AddResponse<S, C, E>>(newEndpoint);
//   }
// }

// class BuildResHeader<
//   E extends Partial<EndpointDefinition>
// > extends BuildResponse<E> {
//   constructor(readonly endpoint: E) {
//     super(endpoint);
//   }

//   resHeader<N extends string, V extends HeaderValue, O = V>(
//     name: UniqueResHeader<N, E>
//   ): BuildResHeader<AddResHeader<N, V, O, E>>;
//   resHeader<N extends string, V extends HeaderValue, O>(
//     name: UniqueResHeader<N, E>,
//     // tslint:disable-next-line: unified-signatures
//     encoder: ToHeaderValue<V, O>
//   ): BuildResHeader<AddResHeader<N, V, O, E>>;
//   resHeader<N extends string, V extends HeaderValue, O>(
//     name: UniqueResHeader<N, E>,
//     encoder?: ToHeaderValue<V, O>
//   ): BuildResHeader<AddResHeader<Cast<N, string>, V, O, E>> {
//     const { resHeaders, ...noResHeaders } = this.endpoint;
//     if (resHeaders?.find(_ => _.name === name)) {
//       throw new Error(`Response header [${name}] already specified`);
//     }
//     const newResHeaders: ResHeader<string, any, any>[] = [
//       ...(resHeaders ?? []),
//       encoder ? resHeader(name, encoder) : resHeader(name)
//     ];
//     const newEndpoint = {
//       ...noResHeaders,
//       resHeaders: newResHeaders
//     } as AddResHeader<Cast<N, string>, V, O, E>;
//     return new BuildResHeader<AddResHeader<Cast<N, string>, V, O, E>>(
//       newEndpoint
//     );
//   }
// }

// class BuildBody<E extends Partial<EndpointDefinition>> extends BuildResHeader<
//   E
// > {
//   constructor(readonly endpoint: E) {
//     super(endpoint);
//   }

//   body<O, M extends MimeType<any>, D extends MimeDecoder<M, O>>(
//     mimeDecoder: D
//   ): BuildResHeader<E & HasBody<D>> {
//     return new BuildResHeader<E & HasBody<D>>({
//       ...this.endpoint,
//       bodyDecoder: mimeDecoder
//     });
//   }
// }

// class BuildQueryParam<E extends Partial<EndpointDefinition>> extends BuildBody<
//   E
// > {
//   constructor(readonly endpoint: E) {
//     super(endpoint);
//   }

//   query<P extends string, O = string>(
//     param: UniqueQueryParam<P, E>
//   ): BuildQueryParam<AddQueryParam<P, E, O>>;
//   query<P extends string, O = string>(
//     param: UniqueQueryParam<P, E>,
//     // tslint:disable-next-line: unified-signatures
//     decoder: FromQueryParam<O>
//   ): BuildQueryParam<AddQueryParam<P, E, O>>;
//   query<P extends string, O = string>(
//     param: UniqueQueryParam<P, E>,
//     decoder?: FromQueryParam<O>
//   ): BuildQueryParam<AddQueryParam<P, E, O>> {
//     // tslint:disable-next-line: no-shadowed-variable
//     const { queryParams, ...noQueryParams } = this.endpoint;
//     if (queryParams?.find(_ => _.name === param)) {
//       throw new Error(`Query parameter [${param}] already specified`);
//     }
//     const newQueryParams: QueryParam<string, any>[] = [
//       ...(queryParams ?? []),
//       decoder ? queryParam(param, decoder) : queryParam(param)
//     ];
//     const newEndpoint = {
//       ...noQueryParams,
//       queryParams: newQueryParams
//     } as AddQueryParam<P, E, O>;
//     return new BuildQueryParam<AddQueryParam<P, E, O>>(newEndpoint);
//   }
// }

// class BuildReqHeader<
//   E extends Partial<EndpointDefinition>
// > extends BuildQueryParam<E> {
//   constructor(readonly endpoint: E) {
//     super(endpoint);
//   }

//   reqHeader<N extends string, V extends HeaderValue, O = V>(
//     name: UniqueReqHeader<N, E>
//   ): BuildReqHeader<AddReqHeader<N, V, O, E>>;
//   reqHeader<N extends string, V extends HeaderValue, O>(
//     name: UniqueReqHeader<N, E>,
//     // tslint:disable-next-line: unified-signatures
//     decoder: FromHeaderValue<V, O>
//   ): BuildReqHeader<AddReqHeader<N, V, O, E>>;
//   reqHeader<N extends string, V extends HeaderValue, O>(
//     name: UniqueReqHeader<N, E>,
//     decoder?: FromHeaderValue<V, O>
//   ): BuildReqHeader<AddReqHeader<Cast<N, string>, V, O, E>> {
//     const { reqHeaders, ...noReqHeaders } = this.endpoint;
//     if (reqHeaders?.find(_ => _.name === name)) {
//       throw new Error(`Request header [${name}] already specified`);
//     }
//     const newReqHeaders: ReqHeader<string, any, any>[] = [
//       ...(reqHeaders ?? []),
//       decoder ? reqHeader(name, decoder) : reqHeader(name)
//     ];
//     const newEndpoint = {
//       ...noReqHeaders,
//       reqHeaders: newReqHeaders
//     } as AddReqHeader<Cast<N, string>, V, O, E>;
//     return new BuildReqHeader<AddReqHeader<Cast<N, string>, V, O, E>>(
//       newEndpoint
//     );
//   }
// }

// export function zipWith<A, B, C>(fa: A[], fb: B[], f: (a: A, b: B) => C): C[] {
//   const fc = [];
//   const len = Math.max(fa.length, fb.length);
//   for (let i = 0; i < len; i++) {
//     fc[i] = f(fa[i], fb[i]);
//   }
//   return fc;
// }

// function build<T extends Capture<string, unknown>[], M extends HTTPMethod>(
//   method: M,
//   fragments: TemplateStringsArray,
//   captures: NotRepeating<T, "identifier">
// ): BuildReqHeader<HasURLPath & HasHTTPMethod<M> & HasCaptures<T>> {
//   return new BuildReqHeader<HasURLPath & HasHTTPMethod<M> & HasCaptures<T>>({
//     path: zipWith(fragments.raw as string[], captures, (f, c) => {
//       const identifier = c?.identifier ? `:${c.identifier}` : "";
//       return (f ?? "") + identifier;
//     }).join(""),
//     captures,
//     method
//   });
// }

// export function GET<T extends Capture<string, unknown>[]>(
//   fragments: TemplateStringsArray,
//   ...captures: NotRepeating<T, "identifier">
// ): NoBody<
//   BuildReqHeader<HasURLPath & HasHTTPMethod<"GET"> & HasCaptures<T>>,
//   "GET"
// > {
//   return build<T, "GET">("GET", fragments, captures);
// }

// export function DELETE<T extends Capture<string, unknown>[]>(
//   fragments: TemplateStringsArray,
//   ...captures: NotRepeating<T, "identifier">
// ): NoBody<
//   BuildReqHeader<HasURLPath & HasHTTPMethod<"DELETE"> & HasCaptures<T>>,
//   "DELETE"
// > {
//   return build<T, "DELETE">("DELETE", fragments, captures);
// }

// export function POST<T extends Capture<string, unknown>[]>(
//   fragments: TemplateStringsArray,
//   ...captures: NotRepeating<T, "identifier">
// ): BuildReqHeader<HasURLPath & HasHTTPMethod<"POST"> & HasCaptures<T>> {
//   return build<T, "POST">("POST", fragments, captures);
// }

// export function PUT<T extends Capture<string, unknown>[]>(
//   fragments: TemplateStringsArray,
//   ...captures: NotRepeating<T, "identifier">
// ): BuildReqHeader<HasURLPath & HasHTTPMethod<"PUT"> & HasCaptures<T>> {
//   return build<T, "PUT">("PUT", fragments, captures);
// }

// export function HEAD<T extends Capture<string, unknown>[]>(
//   fragments: TemplateStringsArray,
//   ...captures: NotRepeating<T, "identifier">
// ): BuildReqHeader<HasURLPath & HasHTTPMethod<"HEAD"> & HasCaptures<T>> {
//   return build<T, "HEAD">("HEAD", fragments, captures);
// }

// export function PATCH<T extends Capture<string, unknown>[]>(
//   fragments: TemplateStringsArray,
//   ...captures: NotRepeating<T, "identifier">
// ): BuildReqHeader<HasURLPath & HasHTTPMethod<"PATCH"> & HasCaptures<T>> {
//   return build<T, "PATCH">("PATCH", fragments, captures);
// }

// export function CONNECT<T extends Capture<string, unknown>[]>(
//   fragments: TemplateStringsArray,
//   ...captures: NotRepeating<T, "identifier">
// ): BuildReqHeader<HasURLPath & HasHTTPMethod<"CONNECT"> & HasCaptures<T>> {
//   return build<T, "CONNECT">("CONNECT", fragments, captures);
// }

// export function TRACE<T extends Capture<string, unknown>[]>(
//   fragments: TemplateStringsArray,
//   ...captures: NotRepeating<T, "identifier">
// ): BuildReqHeader<HasURLPath & HasHTTPMethod<"TRACE"> & HasCaptures<T>> {
//   return build<T, "TRACE">("TRACE", fragments, captures);
// }

// export function OPTIONS<T extends Capture<string, unknown>[]>(
//   fragments: TemplateStringsArray,
//   ...captures: NotRepeating<T, "identifier">
// ): BuildReqHeader<HasURLPath & HasHTTPMethod<"OPTIONS"> & HasCaptures<T>> {
//   return build<T, "OPTIONS">("OPTIONS", fragments, captures);
// }

export class ResponseWithHeaders<A, HS extends object> {
  constructor(readonly response: A, readonly headers: HS) {}
}

export function withHeaders<A, HS extends object>(
  response: A,
  headers: HS
): ResponseWithHeaders<A, HS> {
  return new ResponseWithHeaders(response, headers);
}

export function isResponseWithHeaders<A, HS extends object>(
  response: any
): response is ResponseWithHeaders<A, HS> {
  return response instanceof ResponseWithHeaders;
}
