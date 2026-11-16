# Playwright API Testing Practice

A TypeScript learning project developed while following a Udemy course on Playwright API testing. It exercises the Conduit demo application and explores reusable API test helpers, JSON Schema validation, and browser testing.

This repository shows my practice work and is still evolving. It is not a production framework, and no passing CI status is claimed.

## Skills practised

- HTTP requests and status assertions for GET, POST, PUT, and DELETE.
- Authentication with a token created through the login API.
- Article creation, retrieval, update, and deletion scenarios.
- Parameterized negative tests for username validation.
- Reusable Playwright fixtures and a chainable request handler.
- Custom assertions with request and response details for debugging.
- JSON Schema generation with `genson-js` and validation with Ajv.
- Adding `date-time` formats to nested `createdAt` and `updatedAt` fields.
- Test data generation with Faker.
- A browser scenario for creating and deleting an article.

## Project structure

```text
tests/api-tests/       API examples, smoke scenarios, and negative tests
tests/ui-tests/        Browser test
helpers/              Login token helper
utils/                Request handler, fixtures, logging, and schema utilities
request-objects/      Reusable request payload
response-schemas/     Saved JSON Schemas for articles and tags
api-test.config.ts    API URL and environment configuration
playwright.config.ts Playwright projects and reporting configuration
```

`utils/schema-generator-instructor.ts` is a separate reference version for comparing the instructor's recursive schema helper with the version used by the validator.

## Local setup

Use a current Node.js LTS release compatible with the dependencies in `package.json`.

```bash
npm ci
cp .env.example .env
```

Fill in `PROD_USERNAME` and `PROD_PASSWORD` in `.env` using your own Conduit demo account. The default environment is `prod`, which points to the public demo application. Optional credentials for other environment choices are listed in `.env.example`.

```bash
# Run the API examples selected by the current configuration
npx playwright test --project=api-smoke-tests

# Install Chromium and run the browser scenario
npx playwright install chromium
npx playwright test --project=ui-tests

# Open the local HTML report after a run
npx playwright show-report
```

The tests create, update, and delete demo data. Use a dedicated test account. Local credentials, test reports, browser traces, and network captures are excluded from Git. API failure logs may contain request bodies and authentication details; review them before sharing.

## Current scope and next steps

- The current API project selection runs `example.spec.ts`. The fixture-based smoke and negative test files are additional practice code and are not selected by the current `testMatch` configuration.
- Some assertions depend on the public demo application's data, such as tag names and article counts.
- Schema generation is an explicit action; normal validation uses the saved schemas. Generated schemas should be reviewed before being treated as contracts.
- The date format helper supports the object and array structures used here; it is not a complete JSON Schema traversal engine.
- Future improvements include CI execution, more independent test data, and redaction of sensitive values in logs.

## Learning context

The implementation follows course exercises and includes an instructor-style reference example. I use this repository to practise the code, understand the design decisions, and discuss the tradeoffs during interviews.
