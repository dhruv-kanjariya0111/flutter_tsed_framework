# Ts.ED Backend Rules

## Controllers
- @Controller('/resource') at class level. Method decorators: @Get/@Post/@Put/@Delete/@Patch.
- ZERO business logic. Delegate everything to @Service.
- Return response DTOs only — never raw Prisma/DB types.
- @UseAuth(JwtMiddleware) on every non-public endpoint.
- @Summary() and @Returns() decorators for OpenAPI documentation.
- Route prefix: /api/v1/ (versioning mandatory).

## Services
- @Service() decorator. Business logic lives here exclusively.
- No Request/Response types in service signatures.
- Use Prisma for data access. Wrap in try/catch → throw Ts.ED HTTP exceptions.
- $transaction() for any multi-step database operations.

## DTOs
- All request DTOs: @Property() + class-validator (@IsEmail, @MinLength, @IsNotEmpty).
- All response DTOs: exclude sensitive fields (passwords, internal tokens).
- Separate Create/Update/Response DTOs per resource.

## Security (MANDATORY — never skip)
- Rate limiting: @UseInterceptors(RateLimitInterceptor) on all public auth endpoints.
- Helmet.js: enabled in Server.ts via platform middleware.
- CORS: explicit whitelist array. Never allowedOrigins: '*' in production.
- Input sanitization: sanitize-html on all user-supplied string inputs.
- JWT: access token TTL 15 minutes. Refresh token TTL 7 days with rotation.
- API keys: environment variables only. Never committed to source.

## OpenAPI Contract Discipline
- Update shared/openapi.yaml BEFORE writing any implementation code.
- Run npm run openapi:validate after every schema change.
- Version: /api/v1/ prefix. Breaking changes → /api/v2/ with deprecation headers.
