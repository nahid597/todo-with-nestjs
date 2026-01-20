## Todo API (NestJS + TypeORM)

Feature-complete Todo REST API built with NestJS 10, PostgreSQL, and JWT authentication. The service exposes Todo CRUD endpoints, user registration/login, global request validation, and a response interceptor that normalizes every HTTP payload.

### Highlights

- Modular architecture: `AuthModule`, `UsersModule`, `TodosModule`, `DbModule`, and a global `ConfigModule` configured in [src/app.module.ts](src/app.module.ts).
- TypeORM integration with PostgreSQL (see [src/database/db.module.ts](src/database/db.module.ts)) and entity auto-loading for `TodoEntity` and `User` definitions.
- JWT authentication powered by `@nestjs/passport` and `JwtStrategy` ([src/modules/auth/strategies/jwt.strategy.ts](src/modules/auth/strategies/jwt.strategy.ts)).
- Validation and transformation enforced by `ValidationPipe`, plus consistent JSON envelopes via [ResponseInterceptor](src/common/interceptors/response.interceptor.ts).
- Simple DTO-driven services for todos ([src/modules/todo/todo.service.ts](src/modules/todo/todo.service.ts)) and auth ([src/modules/auth/auth.service.ts](src/modules/auth/auth.service.ts)).

## Prerequisites

- Node.js 18+ and npm 9+
- Running PostgreSQL instance (local Docker or managed service)

## Installation

```bash
npm install
```

## Environment variables

Create a `.env` file in the project root before starting the server:

```
PORT=3000
JWT_SECRET_KEY=change-me
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=todos_db
```

> `TypeOrmModule` is currently configured with `synchronize: true`. Keep it on for local development only; switch off when running migrations in production.

## Running the API

```bash
# watch mode with hot reload
npm run start:dev

# production build
npm run build && npm run start:prod
```

The server boots on `http://localhost:${PORT}` (defaults to 3000) and automatically enables validation/transform pipes plus the response interceptor that wraps every payload as:

```json
{
  "timestamp": "2026-01-21T04:15:08.000Z",
  "data": { ...actual payload }
}
```

Each response also echoes the incoming `x-userid` header as `user-id`.

## API overview

| Method | Route | Description | Auth |
| --- | --- | --- | --- |
| POST | `/auth/register` | Create a user (`name`, `email`, `password`) | Public |
| POST | `/auth/login` | Exchange credentials for `accessToken` | Public |
| GET | `/todos` | List todos ordered by `createdAt DESC` | Public |
| POST | `/todos` | Create a todo (`title`) | Public |
| PATCH | `/todos/:id` | Update title/completed flags | Public |
| DELETE | `/todos/:id` | Delete a todo and return a status message | Bearer token required |

> Protected endpoints use `JwtAuthGuard`. Pass `Authorization: Bearer <accessToken>` in Postman or any HTTP client.

### Typical flow

```bash
# register once
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ada","email":"ada@example.com","password":"secret"}'

# login and capture the accessToken
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ada@example.com","password":"secret"}'

# delete a todo using the token
curl -X DELETE http://localhost:3000/todos/1 \
  -H "Authorization: Bearer <token>"
```

## Testing & linting

```bash
npm run test        # unit tests
npm run test:e2e    # e2e suite (uses test/jest-e2e.json)
npm run lint        # eslint + prettier
```

## Project structure

```
src/
├── common/interceptors/response.interceptor.ts
├── config/db.config.ts
├── database/db.module.ts
├── main.ts
└── modules
    ├── auth
    ├── todo
    └── users
```

Feel free to open an issue or submit a PR if you add features such as pagination, ownership enforcement, or production-ready migrations.
