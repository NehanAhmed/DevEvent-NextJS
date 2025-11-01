# PostHog Configuration Tests

This directory contains unit tests for PostHog configuration in the Next.js application.

## Test Files

### `instrumentation-client.test.ts`
Tests for PostHog client-side initialization configuration.

**Test Coverage:**
1. ✅ PostHog is initialized with the correct API host (`/ingest`)
2. ✅ PostHog is initialized with the correct UI host (`https://us.posthog.com`)
3. ✅ PostHog is configured to capture exceptions (`capture_exceptions: true`)
4. ✅ PostHog debug mode is correctly set based on the environment:
   - `true` in development environment
   - `false` in production environment
   - `false` in test environment

### `next.config.test.ts`
Tests for Next.js rewrite rules configuration for PostHog.

**Test Coverage:**
1. ✅ The `/ingest/:path*` rewrite rule is correctly configured
   - Source: `/ingest/:path*`
   - Destination: `https://us.i.posthog.com/:path*`

2. ✅ The `/ingest/static/:path*` rewrite rule is correctly configured
   - Source: `/ingest/static/:path*`
   - Destination: `https://us-assets.i.posthog.com/static/:path*`

3. ✅ Rewrite rules are in the correct order (static paths before dynamic paths)
4. ✅ `skipTrailingSlashRedirect` is enabled for PostHog compatibility

## Installation

Install the test dependencies:

```bash
npm install
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage report
```bash
npm run test:coverage
```

## Test Structure

The tests use Jest as the testing framework with the following key features:

- **Mocking**: PostHog library is mocked to prevent actual API calls during tests
- **Environment Variables**: Tests validate different behaviors based on `NODE_ENV`
- **Module Isolation**: Each test resets modules to ensure clean state
- **Comprehensive Coverage**: All five requested test cases are covered with multiple test scenarios

## Coverage Goals

The Jest configuration is set up with the following coverage thresholds:
- Branches: 80%
- Functions: 80%
- Lines: 80%
- Statements: 80%

## What's Being Tested

### PostHog Client Initialization (`instrumentation-client.ts`)
- API host configuration
- UI host configuration
- Exception capturing settings
- Debug mode based on environment variables
- Complete configuration object validation

### Next.js Configuration (`next.config.ts`)
- Rewrite rules for PostHog ingestion endpoints
- Rewrite rules for PostHog static assets
- Rule ordering to prevent conflicts
- Trailing slash redirect configuration

## Notes

- Tests use `jest.mock()` to mock the PostHog library, preventing actual network calls
- Environment variables are reset between tests to ensure isolation
- The `next.config.ts` rewrites function is tested by calling it directly and validating the returned configuration
