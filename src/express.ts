/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  MimeEncoder,
  HasURLPath,
  HasHTTPMethod,
  HttpMethod,
  HasResponse,
  QueryParam,
  EndpointDefinition,
  ReqHeader,
  MimeDecoder,
  StatusCode,
  ResponseWithHeaders,
  Capture,
  isResponseWithHeaders,
  ResHeader,
} from "./core";
import { Tail } from "type-ts";
import * as express from "express";
import { fold, Either } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import { identity } from "fp-ts/lib/function";

type QueryMap<Q extends QueryParam<string, any>[]> = {
  "0": {};
  n: { [k in Q[0]["name"]]: Q[0]["_O"] } & QueryMap<Tail<Q>>;
}[Q extends [] ? "0" : "n"];
type WithQueryParams<A> = A extends { queryParams: infer QP }
  ? QP extends QueryParam<string, any>[]
    ? { query: QueryMap<QP> }
    : {}
  : {};

type HeaderMap<Q extends ReqHeader<string, any, any>[]> = {
  "0": Record<string, never>;
  n: { [k in Q[0]["name"]]: Q[0]["_O"] } & HeaderMap<Tail<Q>>;
}[Q extends [] ? "0" : "n"];
type WithHeaders<A> = A extends { reqHeaders: infer HS }
  ? HS extends ReqHeader<string, any, any>[]
    ? { headers: HeaderMap<HS> }
    : {}
  : {};
type WithResHeaders<A> = A extends { resHeaders: infer HS }
  ? HS extends ResHeader<string, any, any>[]
    ? { resHeaders: HeaderMap<HS> }
    : {}
  : {};
type ResHeaderMap<A> = A extends { resHeaders: infer HS }
  ? HS extends ResHeader<string, any, any>[]
    ? HeaderMap<HS>
    : Record<string, never>
  : Record<string, never>;

type WithBody<A> = A extends { bodyDecoder: infer B }
  ? B extends MimeDecoder<any, infer O>
    ? { body: O }
    : {}
  : {};

type CaptureMap<Q extends Capture<any, any>[]> = {
  "0": {};
  n: { [k in Q[0]["identifier"]]: Q[0]["_O"] } & CaptureMap<Tail<Q>>;
}[Q extends [] ? "0" : "n"];
type WithCaptures<A> = A extends { captures: infer C }
  ? C extends Capture<any, any>[]
    ? { captures: CaptureMap<C> }
    : {}
  : {};

type ApiEndpoint = Partial<EndpointDefinition> &
  HasURLPath &
  HasHTTPMethod<HttpMethod> &
  HasResponse<MimeEncoder<any, any>, StatusCode>;

type HandlerResult<A extends ApiEndpoint> = A extends { resHeaders: infer HS }
  ? HS extends ResHeader<string, any, any>[]
    ? ResponseWithHeaders<A["resEncoder"]["_I"], ResHeaderMap<A>>
    : A["resEncoder"]["_I"]
  : A["resEncoder"]["_I"];

type Handler<A extends ApiEndpoint> = (
  ctx: WithCaptures<A> &
    WithQueryParams<A> &
    WithHeaders<A> &
    WithBody<A> &
    WithResHeaders<A>
) => Promise<HandlerResult<A>> | HandlerResult<A>;

export function addToRouter<A extends ApiEndpoint>(
  api: A,
  handler: Handler<A>,
  router: express.Router
): express.Router {
  function getOrThrow<B>(either: Either<unknown, B>): B {
    return pipe(
      either,
      fold((e) => {
        throw e;
      }, identity)
    );
  }

  const middleware = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    try {
      const ctx = ({
        captures: api.captures?.reduce((cs, c) => {
          const value = c.decoder(req.param(c.identifier));
          return {
            ...cs,
            [c.identifier]: getOrThrow(value),
          };
        }, {}),
        headers: api.reqHeaders?.reduce((hs, h) => {
          const value = h.decoder(req.header(h.name));
          return {
            ...hs,
            [h.name]: getOrThrow(value),
          };
        }, {}),
        query: api.queryParams?.reduce((qps, qp) => {
          const value = qp.decoder(req.query[qp.name]);
          return {
            ...qps,
            [qp.name]: getOrThrow(value),
          };
        }, {}),
        body: ((): void => {
          const value = api.bodyDecoder?.decoder(req.body);
          return value ? getOrThrow(value) : undefined;
        })(),
      } as any) as WithCaptures<A> &
        WithQueryParams<A> &
        WithHeaders<A> &
        WithResHeaders<A> &
        WithBody<A>;
      const result = await handler(ctx);
      res.status(api.status);
      res.setHeader("Content-Type", api.resEncoder.contentType.mimeType);
      if (isResponseWithHeaders(result)) {
        api.resHeaders?.forEach((h) => {
          const value = h.decoder(result.headers[h.name]);
          res.setHeader(h.name, getOrThrow(value));
        });
        const response = api.resEncoder.encoder(result.response);
        res.send(response);
      } else {
        const response = api.resEncoder.encoder(result);
        res.send(response);
      }
      next();
    } catch (e) {
      next(e);
    }
  };
  const end = (_req: express.Request, res: express.Response): void => {
    res.end();
  };
  switch (api.method) {
    case "GET":
      router.get(api.path, middleware, end);
      return router;
    case "POST":
      router.post(api.path, middleware, end);
      return router;
    case "PUT":
      router.put(api.path, middleware, end);
      return router;
    case "PATCH":
      router.patch(api.path, middleware, end);
      return router;
    case "DELETE":
      router.delete(api.path, middleware, end);
      return router;
    case "HEAD":
      router.head(api.path, middleware, end);
      return router;
    case "TRACE":
      router.trace(api.path, middleware, end);
      return router;
    case "CONNECT":
      router.connect(api.path, middleware, end);
      return router;
    case "OPTIONS":
      router.options(api.path, middleware, end);
      return router;
  }
}

export function createRouter<A extends ApiEndpoint>(
  api: A,
  handler: Handler<A>
): express.Router {
  return addToRouter(api, handler, express.Router());
}

type Api = Record<string, ApiEndpoint>;
type Handlers<A extends Api> = { [K in keyof A]: Handler<A[K]> };

export function createApi<A extends Api>(
  api: A,
  handlers: Handlers<A>
): express.Router {
  return Object.entries(api).reduce(
    (router, [name, apiEndpoint]) =>
      addToRouter(apiEndpoint, handlers[name], router),
    express.Router()
  );
}
