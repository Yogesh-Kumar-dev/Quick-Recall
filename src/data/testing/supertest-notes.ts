import type { Note } from '@/types/content';

// ─── Supertest — the standard tool for testing Express/Nest/Fastify HTTP APIs
// in-process, without binding a real port. Paired with Vitest or Jest as the runner. ─

export const supertestNotes: Note[] = [
  {
    id: 'supertest-what-and-why',
    title: 'What Supertest Does (and why not just call fetch)',
    summary:
      'Supertest wraps your Express app directly and fires requests at it IN-PROCESS — no real port bound, no network involved — while still asserting against real HTTP status codes, headers, and bodies.',
    difficulty: 'basic',
    category: 'Supertest',
    prerequisites: ['test-fund-choosing-a-stack', 'expressjs-fundamentals'],
    keyPoints: [
      '`request(app)` takes your Express `app` object directly (not a URL) — Supertest starts an ephemeral in-process server for the duration of each request and tears it down automatically.',
      'This is meaningfully different from hitting a real running server with `fetch`: no port conflicts between parallel test files, no "did the server finish starting" race condition, and requests run as fast as function calls.',
      "You still get genuine HTTP-layer testing — real status codes, real header parsing, real body serialization — unlike calling a controller function directly, which would skip Express's routing, middleware chain, and error-handling entirely.",
      'This sits at the "integration" layer of the pyramid: it exercises route → middleware → controller → service together, typically with the database mocked or swapped for a test instance.'
    ],
    codeSnippet: `import request from 'supertest';
import { app } from '../app';

test('GET /health returns 200', async () => {
  const res = await request(app).get('/health');
  expect(res.status).toBe(200);
});`
  },
  {
    id: 'supertest-basic-requests',
    title: 'Making Requests: .get/.post/.send/.expect',
    summary:
      'A fluent, chainable API — `.send()` attaches a JSON body, `.expect()` asserts on status code (or headers, or the body itself) inline.',
    difficulty: 'basic',
    category: 'Supertest',
    prerequisites: ['supertest-what-and-why'],
    keyPoints: [
      "`request(app).post('/users').send({ email, password })` — `.send()` auto-sets `Content-Type: application/json` for a plain object body.",
      "`.expect(201)` asserts the status code inline and throws a descriptive error if it doesn't match — chainable, so `.expect(201).expect('Content-Type', /json/)` checks multiple things in sequence.",
      "The response object (`res`) still needs explicit assertions on its body via your test runner's `expect` — `expect(res.body).toEqual({ id: 1, email })` — Supertest's own `.expect()` is for quick inline checks, not a replacement for the runner's assertion library.",
      "`.set('Authorization', 'Bearer ' + token)` attaches headers — the standard way to test authenticated routes once a token has been obtained (see the authentication-flow note).",
      "Query strings: `.get('/users').query({ page: 2, limit: 10 })` builds `?page=2&limit=10` without manual string concatenation."
    ],
    codeSnippet: `const res = await request(app)
  .post('/users')
  .send({ email: 'ada@example.com', password: 'hunter2' })
  .expect(201);

expect(res.body).toMatchObject({ email: 'ada@example.com' });
expect(res.body).not.toHaveProperty('password'); // never leak the hash back`
  },
  {
    id: 'supertest-testing-auth-flow',
    title: 'Testing an Authentication Flow',
    summary:
      'The classic Supertest interview exercise: POST /login returns 200 + a token on valid credentials, and 401 on an invalid password — with a couple of edge cases in between.',
    difficulty: 'intermediate',
    category: 'Supertest',
    prerequisites: ['supertest-basic-requests', 'auth-jwt'],
    keyPoints: [
      "Happy path: `POST /login` with valid credentials returns `200` and a body containing a JWT (or sets a session cookie) — assert on both the status and the shape of what's returned, not just one or the other.",
      'Invalid password: same email, wrong password, returns `401` — NOT `404` (the user exists) and NOT `400` (the request itself is well-formed) — this distinction is a common thing interviewers probe.',
      'Unknown email: many APIs deliberately return the SAME `401` (not a distinct "user not found" error) to avoid leaking which emails are registered — a security-conscious detail worth mentioning.',
      "Using the returned token on a subsequent authenticated request (request(app).get('/me').set('Authorization', 'Bearer ' + token)) verifies the whole login → authenticated-request cycle works end to end, not just the login endpoint in isolation.",
      'Rate limiting / lockout after repeated failed attempts is a natural follow-up test once the basic flow is covered — asserting the N+1th attempt returns `429`.'
    ],
    codeSnippet: `test('returns a token for valid credentials', async () => {
  const res = await request(app)
    .post('/login')
    .send({ email: 'ada@example.com', password: 'correct-password' });
  expect(res.status).toBe(200);
  expect(res.body.token).toBeDefined();
});

test('returns 401 for an invalid password', async () => {
  const res = await request(app)
    .post('/login')
    .send({ email: 'ada@example.com', password: 'wrong' });
  expect(res.status).toBe(401);
});`
  },
  {
    id: 'supertest-testing-middleware',
    title: 'Testing Middleware',
    summary:
      'Middleware is tested through the routes that use it — send a request that SHOULD be blocked/transformed by the middleware and assert on the observable outcome.',
    difficulty: 'intermediate',
    category: 'Supertest',
    prerequisites: ['supertest-basic-requests'],
    keyPoints: [
      "Auth middleware: hit a protected route with no token (expect `401`), with an invalid/expired token (expect `401`), and with a valid token (expect the route's normal success response) — three tests cover the middleware's full contract.",
      "Validation middleware: send a malformed body (missing required field, wrong type) and assert `400` with a body describing what failed — this also documents the API's validation rules through the tests themselves.",
      "Rate-limiting middleware: fire requests past the configured limit and assert the next one returns `429` — often needs the middleware's window configured very short in the test environment to keep the test fast.",
      'Testing middleware in true isolation (calling the middleware function directly with mocked `req`/`res`/`next`) is possible but less valuable than testing it through a real route — the goal is verifying its OBSERABLE effect on a request, not its internals.'
    ]
  },
  {
    id: 'supertest-mocking-service-layer',
    title: 'Mocking the Service/Repository Layer',
    summary:
      'Route → controller → service → repository: Supertest exercises the top three layers for real, while the repository (the actual database calls) is usually mocked to keep the test fast and independent of a real database.',
    difficulty: 'intermediate',
    category: 'Supertest',
    prerequisites: ['supertest-basic-requests', 'test-fund-mocking-strategies'],
    keyPoints: [
      'Layered architecture (controller → service → repository) exists partly BECAUSE it makes this kind of testing possible — the repository is the seam where a real database swaps for a mock.',
      'Mocking the repository (not the service) keeps the test exercising real business logic (validation rules, calculated fields, error mapping) while avoiding a real database connection — the most common integration-test boundary in a well-layered Node API.',
      'An alternative to mocking: point the test at a real, disposable test database (a Docker container, or an in-memory one like SQLite for a Postgres-compatible ORM) — trades speed for higher confidence that the actual queries work; many teams use both, unit-mocked for most tests and one broader database-backed suite.',
      "Whichever approach is used, tests should reset state between runs (a fresh mock, or a database transaction rolled back after each test) so tests don't depend on execution order."
    ],
    codeSnippet: `vi.mock('../repositories/userRepository');

test('POST /users returns 409 on a duplicate email', async () => {
  (userRepository.create as Mock).mockRejectedValue(new UniqueConstraintError('email'));
  const res = await request(app).post('/users').send({ email: 'taken@example.com' });
  expect(res.status).toBe(409);
});`
  },
  {
    id: 'supertest-mocking-prisma',
    title: 'Mocking Prisma in Tests',
    summary:
      'Two real options: a deep-mocked Prisma Client (`jest-mock-extended`/`vitest-mock-extended`) for pure unit tests, or a real test database for higher-confidence integration tests.',
    difficulty: 'intermediate',
    category: 'Supertest',
    prerequisites: ['supertest-mocking-service-layer'],
    keyPoints: [
      "Deep-mocking the whole `PrismaClient` (`mockDeep<PrismaClient>()` from `vitest-mock-extended`/`jest-mock-extended`) lets you stub `prisma.user.findUnique.mockResolvedValue(...)` for any model/method without a real database — fast, but doesn't verify the actual Prisma query is correct.",
      'A real test database (a disposable Postgres/SQLite instance, migrated fresh per test run or per test file) catches real query bugs a mock cannot — wrong `where` clause, a missing `include`, an actual constraint violation — at the cost of slower, more infrastructure-dependent tests.',
      'A common middle ground: unit/integration tests mock Prisma for speed and route-logic coverage; a smaller, separate suite runs the real queries against a test database (often only in CI, not on every local save) to catch query-level bugs.',
      "Whichever approach, reset state between tests — either re-instantiate the mock, or wrap each test in a database transaction that's rolled back afterward so tests never see each other's data."
    ],
    codeSnippet: `import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';

const prismaMock = mockDeep<PrismaClient>() as DeepMockProxy<PrismaClient>;

test('GET /users/1 returns 404 when the user does not exist', async () => {
  prismaMock.user.findUnique.mockResolvedValue(null);
  const res = await request(app).get('/users/1');
  expect(res.status).toBe(404);
});`
  },
  {
    id: 'supertest-unit-vs-integration-framing',
    title: 'Is a Supertest Test a Unit or Integration Test?',
    summary:
      'Almost always integration: it exercises routing, middleware, controller, and (usually real) validation logic together — even when the database itself is mocked.',
    difficulty: 'basic',
    category: 'Supertest',
    prerequisites: ['test-fund-unit-integration-e2e', 'supertest-testing-middleware'],
    keyPoints: [
      "A Supertest call goes through Express's actual routing and middleware pipeline — that's more than one unit working together, which is the definition of an integration test even with the database mocked out.",
      "It stops short of E2E because there's no real browser, no real network hop, and typically no real database — those are exactly what Playwright's E2E layer adds on top.",
      "This distinction is a common interview question specifically because Supertest tests FEEL like simple, fast unit tests (they run in milliseconds) while actually testing several layers together — the speed doesn't change what layer of the pyramid they sit at.",
      'A true "unit test" of a Node API would call a single controller or service function directly, with `req`/`res` mocked by hand — rarely worth the extra setup compared to just using Supertest, which gets equivalent isolation with far less boilerplate.'
    ]
  }
];
