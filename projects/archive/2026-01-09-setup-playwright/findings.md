# Findings

Research and implementation notes for Playwright setup in this Expo project.

## Research Notes

(To be populated during research phase)

## Implementation Notes

### testID to data-testid Mapping

The Gluestack UI web components (Box, Text) use native HTML elements (div, span) instead of React Native Web components. This means testID props don't automatically map to data-testid. We updated the web versions of Box and Text to explicitly:
1. Accept a `testID` prop in the TypeScript type
2. Map `testID` to `data-testid` on the rendered HTML element

This enables Playwright's `getByTestId()` locator to work correctly.

### tsconfig.json Path Mapping

The tsconfig.json was missing a wildcard path mapping for `@/*`. Added `"@/*": ["*"]` to enable importing root-level files like `@/global.css`.

### Playwright Test Structure

Tests are placed in `e2e/` directory and use the `.spec.ts` extension. Each test file should focus on a specific screen or feature and use descriptive test names.

## Verification

### Verification Command

To run Playwright E2E tests:

```bash
bun run playwright:test
```

This command:
1. Builds the web export (`expo export --platform web`)
2. Starts a local server on port 3000 using `serve`
3. Runs Playwright tests in Chromium, Firefox, and WebKit
4. Reports test results

### Verification Results

```
Running 6 tests using 5 workers

  6 passed (5.1s)
```

All tests pass across all three browsers:
- **Chromium**: 2/2 passed
- **Firefox**: 2/2 passed
- **WebKit**: 2/2 passed

### Test Coverage

The E2E tests verify:
1. `home:container` - Main container element is visible
2. `home:title` - Hello World text displays correctly with "Hello, World!" content

### Notes for Code Reviewers

1. Run `bun run playwright:test` to verify E2E tests pass
2. The `serve` package is installed automatically when running tests
3. Tests run against the `dist/` directory created by web export
4. testID attributes on Gluestack components render as `data-testid` in HTML
