# Servant TS
A Haskell's [Servant](https://www.servant.dev/) inspired library for defining type-safe REST APIs using Typescript.

Right now, it only supports [express](https://expressjs.com/) but it can support other server setups.

## Inspiration and similar projects
Obviously [Servant](https://www.servant.dev/), but also [Rest.ts](https://github.com/hmil/rest.ts) and [RESTyped](https://github.com/rawrmaan/restyped).

## Installation
```shell
npm i -S servant-ts fp-ts io-ts
```

## How to use it
First, you need to define your API, optionally using the awesome library [io-ts](https://github.com/gcanti/io-ts).

```typescript
import * as t from "io-ts";
import { GET, capture, asJson } from "servant-ts/dist/io-ts";

const User = t.strict({
  id: t.Int,
  username: t.string,
  email: t.string
});

/*
 * GET /user/:id
 *  where :id must be an integer
 * 
 * Response example:
 *  Status: 200
 *  Contet-Type: application/json
 *  Body:
 *  {
 *    "id": 1,
 *    "username": "johndoe",
 *    "email": "johndoe@email.com"
 *  }
 */
const api = {
  userById: GET`/user/${capture("id", t.Int)}`
              .response(asJson(User))
};
```

Then, you need to implement tha API:

```typescript
const app = express();

app.use(
  "/api",
  createApi(api, {
    userById: async (request) => {
      const { captures: { id } } = request;
      // get the user, maybe from a database ...
      return user;
    }
  })
);
```

## Example

SOON a [Real World](https://realworld.io/) backend.

## Future work
- [ ] Make it solid
- [ ] Better error handling and specification
- [ ] Swagger specification generator
- [ ] Fastify support
- [ ] JSON schema generator
- [ ] Make io-ts optional
