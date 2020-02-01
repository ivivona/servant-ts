import {
  Capture,
  capture,
  QueryParam,
  queryParam,
  QueryParams,
  queryParams,
  ReqHeader,
  reqHeader,
  POST,
  HasCaptures,
  HasReqHeaders,
  HasQueryParams,
  HasResHeaders,
  ResHeader,
  MimeDecoder,
  MimeEncoder,
  HasBody,
  HasResponse,
  Json,
  HeaderValue,
  JsonC,
  StatusCode
} from "..";
import { right, Either } from "fp-ts/lib/Either";

declare const parseNumber: (_: any) => Either<never, number>;
declare const parseNumbers: (_: string[]) => Either<never, number>;
declare const justNumber: (_: number) => Either<never, number>;
declare const decodeJSON: MimeDecoder<JsonC, any>;
declare const encodeJSON: MimeEncoder<JsonC, any>;

// $ExpectType Capture<"nacho", string>
capture("nacho");

// $ExpectType Capture<"nacho", number>
capture("nacho", parseNumber);

// $ExpectType QueryParam<"nacho", string>
queryParam("nacho");
// $ExpectType QueryParam<"nacho", number>
queryParam("nacho", parseNumber);

// $ExpectType QueryParams<"nacho", string>
queryParams("nacho");
// $ExpectType QueryParams<"nacho", number>
queryParams("nacho", parseNumber);

// $ExpectType ReqHeader<"nacho", string, string>
reqHeader("nacho");
// $ExpectType ReqHeader<"nacho", string, number>
reqHeader("nacho", parseNumber);
// $ExpectType ReqHeader<"nacho", string[], number[]>
reqHeader("nacho", parseNumbers);
// $ExpectType ReqHeader<"nacho", number, number>
reqHeader("nacho", justNumber);

// $ExpectError
POST`/api/users/${capture("id")}/articles/${capture("id")}`;
// $ExpectError
POST`/api/users`.reqHeader("Content-Type").reqHeader("Content-Type");
// $ExpectError
POST`/api/users`
  .reqHeader("Content-Type")
  .body(decodeJSON)
  .reqHeader("Authorization");

// $ExpectError
POST`/api/users`
  .reqHeader("Content-Type")
  .query("q")
  .reqHeader("Authorization");
// $ExpectError
POST`/api/users`.query("q").query("q");
// $ExpectError
POST`/api/users`
  .query("q")
  .body(decodeJSON)
  .query("q");
// $ExpectError
POST`/api/users`
  .resHeader("Content-Type")
  .body(decodeJSON)
  .body(decodeJSON);
// $ExpectError
POST`/api/users`.resHeader("Content-Type").resHeader("Content-Type");
// $ExpectError
POST`/api/users`.response(encodeJSON).body(decodeJSON);
// $ExpectError
POST`/api/users`.response(encodeJSON).response(encodeJSON);
// $ExpectError
POST`/api/users`.response(encodeJSON).resHeader("Content-Type");

// $ExpectType HasCaptures<[Capture<"id", string>, Capture<"articleId", string>]>
POST`/api/users/${capture("id")}/articles/${capture("articleId")}`
  .reqHeader("Content-Type")
  .reqHeader("Authorization")
  .query("q")
  .query("s")
  .body(decodeJSON)
  .resHeader("Content-Type-2")
  .resHeader("Authorization-2")
  .response(encodeJSON);

// $ExpectType HasReqHeaders<[ReqHeader<"Content-Type", HeaderValue, HeaderValue>,ReqHeader<"Authorization", HeaderValue, HeaderValue>]>
POST`/api/users/${capture("id")}/articles/${capture("articleId")}`
  .reqHeader("Content-Type")
  .reqHeader("Authorization")
  .query("q")
  .query("s")
  .body(decodeJSON)
  .resHeader("Content-Type-2")
  .resHeader("Authorization-2")
  .response(encodeJSON);

// $ExpectType HasQueryParams<[QueryParam<"q", string>, QueryParam<"s", string>]>
POST`/api/users/${capture("id")}/articles/${capture("articleId")}`
  .reqHeader("Content-Type")
  .reqHeader("Authorization")
  .query("q")
  .query("s")
  .body(decodeJSON)
  .resHeader("Content-Type-2")
  .resHeader("Authorization-2")
  .response(encodeJSON);

// $ExpectType HasResHeaders<[ResHeader<"Content-Type-2", HeaderValue, HeaderValue>,ResHeader<"Authorization-2", HeaderValue, HeaderValue>]>
POST`/api/users/${capture("id")}/articles/${capture("articleId")}`
  .reqHeader("Content-Type")
  .reqHeader("Authorization")
  .query("q")
  .query("s")
  .body(decodeJSON)
  .resHeader("Content-Type-2")
  .resHeader("Authorization-2")
  .response(encodeJSON);

// $ExpectType HasBody<MimeDecoder<JsonC, string, any>>
POST`/api/users/${capture("id")}/articles/${capture("articleId")}`
  .reqHeader("Content-Type")
  .reqHeader("Authorization")
  .query("q")
  .query("s")
  .body(decodeJSON)
  .resHeader("Content-Type-2")
  .resHeader("Authorization-2")
  .response(encodeJSON);

// $ExpectTypeHasResponse<MimeEncoder<JsonC, string>, StatusCode>
POST`/api/users/${capture("id")}/articles/${capture("articleId")}`
  .reqHeader("Content-Type")
  .reqHeader("Authorization")
  .query("q")
  .query("s")
  .body(decodeJSON)
  .resHeader("Content-Type-2")
  .resHeader("Authorization-2")
  .response(encodeJSON);
