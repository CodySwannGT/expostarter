---
date: 2026-01-10T01:45:47Z
status: complete
last_updated: 2026-01-10
---

# Research: Playwright E2E Testing Setup for Expo Web

## Summary

This research documents the configuration requirements and best practices for setting up Playwright end-to-end testing in an Expo SDK 54 project with expo-router. The project currently has Jest 30 configured for unit/integration testing and Lighthouse CI for web performance monitoring. Playwright will complement these by providing browser-based E2E testing for the exported web application.

## Detailed Findings

### 1. Current Project Architecture

The project is an Expo SDK 54 application with:

- **expo-router ~6.0.21** for file-based routing
- **Gluestack UI v3** for component library
- **NativeWind v4** for styling
- **React 19.2.3** and **React Native 0.81.4**
- **bun** as package manager
- **Jest 30** for unit/integration testing (already configured)
- **Lighthouse CI** for web performance monitoring (already configured)

#### Hello World Screen Implementation

The target screen for testing is located at `app/index.tsx`:

```typescript
// /Users/cody/workspace/thumbwar/frontend/app/index.tsx:17-23
export default function Index(): React.JSX.Element {
  return (
    <Box className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold text-gray-900">Hello, World!</Text>
    </Box>
  );
}
```

This component:
- Uses Gluestack UI `Box` and `Text` components
- Renders "Hello, World!" text with Tailwind CSS classes via NativeWind
- Has no current testID or aria-label attributes (will need to be added for E2E testing)

#### Root Layout Structure

The app uses a standard Expo Router layout at `app/_layout.tsx`:

```typescript
// /Users/cody/workspace/thumbwar/frontend/app/_layout.tsx:21-29
export default function RootLayout(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <GluestackUIProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}
```

### 2. Existing Testing Infrastructure

#### Jest Configuration

The project has a multi-project Jest configuration at `jest.config.js`:

- **eslint-plugins project**: Node.js environment for linting plugin tests
- **expo project**: Uses `jest-expo` preset with React Native transformations
- **Coverage threshold**: 98% on all metrics (branches, functions, lines, statements)
- **Test patterns**: `__tests__/**/*.(test|spec).[jt]s?(x)` and similar

#### Existing Unit Tests

Unit tests exist at `app/__tests__/index.test.tsx`:

```typescript
// Uses @testing-library/react-native
// Tests: renders without crashing, displays "Hello, World!" text, renders container element
```

Integration tests at `app/__tests__/index.integration.test.tsx`:

```typescript
// Tests with full provider stack (SafeAreaProvider, GluestackUIProvider)
// Mocks GluestackUIProvider due to nativewind vars dependency
```

#### Lighthouse CI Configuration

Located at `lighthouserc.js`:

- Runs 5 Lighthouse audits per URL
- Uses `./dist` as static directory (from `expo export --platform web`)
- Performance baseline: 36/100 (with long-term target of 85+)
- Uses `npx serve dist` pattern for local testing

### 3. Expo Web Export Configuration

#### Current app.json Web Configuration

```json
// /Users/cody/workspace/thumbwar/frontend/app.json:41-44
"web": {
  "favicon": "./assets/favicon.png",
  "bundler": "metro"
}
```

Note: The current configuration does not include `"output": "static"` which is required for static rendering. This should be added for Playwright testing.

#### Static Export Command

Per [Expo documentation](https://docs.expo.dev/router/reference/static-rendering/):

```bash
npx expo export --platform web
```

This creates a `dist` directory with the statically rendered website. The static output can be served locally with:

```bash
npx serve dist
```

### 4. Playwright Configuration Best Practices

#### Recommended Configuration Structure

Based on [Playwright documentation](https://playwright.dev/docs/test-configuration) and [BrowserStack best practices](https://www.browserstack.com/guide/playwright-best-practices):

```typescript
// playwright.config.ts (proposed)
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  webServer: {
    command: 'npx serve dist -l 3000',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

#### Key Configuration Points

1. **webServer option**: Automatically starts a local server before tests and shuts it down after
2. **reuseExistingServer**: Set to `!process.env.CI` to reuse existing server during development
3. **fullyParallel**: Enables parallel test execution for faster runs
4. **retries**: Set to 2 on CI for flaky test resilience

### 5. Test Selector Best Practices

#### Selector Priority (from [Playwright documentation](https://playwright.dev/docs/locators) and [Testing Library](https://testing-library.com/docs/queries/about/#priority))

1. **getByRole** (accessibility-first, most recommended)
2. **getByText** (for visible text content)
3. **getByLabel** (for form elements with labels)
4. **getByTestId** (fallback for elements without semantic selectors)

#### React Native Web testID Behavior

Per [Detox documentation](https://wix.github.io/Detox/docs/guide/test-id/) and research:

- React Native's `testID` prop renders as `data-testid` in HTML on web
- On iOS: maps to `accessibilityIdentifier`
- On Android: maps to `contentDescription` or `resource-id`

#### Recommended Approach for Expo Web

```typescript
// Component with testID
<Box testID="home-container">
  <Text testID="hello-world-text">Hello, World!</Text>
</Box>

// Playwright test using data-testid
await expect(page.getByTestId('hello-world-text')).toHaveText('Hello, World!');

// Or using getByRole with accessible name (preferred)
await expect(page.getByRole('heading', { name: 'Hello, World!' })).toBeVisible();
```

#### Accessibility Considerations

Per [BrowserStack](https://www.browserstack.com/guide/playwright-get-by-aria-label):

- **Use semantic selectors first**: `getByRole` reflects how screen readers interpret elements
- **aria-label for accessibility, not testing**: Keep aria-labels meaningful for users
- **testID as fallback**: Use when semantic selectors are not available
- **Namespace testIDs**: Use patterns like `screen:element` (e.g., `home:title`)

### 6. Integration with Existing Jest Setup

Playwright and Jest can coexist without conflict:

- **Jest**: Unit and integration tests (`*.test.tsx`, `*.integration.test.tsx`)
- **Playwright**: E2E browser tests (`e2e/*.spec.ts`)
- **Separate directories**: Keep Playwright tests in `e2e/` directory
- **Separate configurations**: `jest.config.js` for Jest, `playwright.config.ts` for Playwright
- **Separate scripts**: Different npm scripts for each test type

#### Recommended Directory Structure

```
frontend/
├── app/
│   ├── __tests__/          # Jest unit/integration tests
│   │   ├── index.test.tsx
│   │   └── index.integration.test.tsx
│   └── index.tsx
├── e2e/                    # Playwright E2E tests
│   └── home.spec.ts
├── jest.config.js
├── playwright.config.ts
└── package.json
```

### 7. Verification Command Requirements

The brief requires a single command that code reviewers can run to verify the setup. Based on the research:

**Recommended verification command:**

```bash
bun run playwright:test
```

This should be backed by npm scripts:

```json
{
  "scripts": {
    "playwright:build": "expo export --platform web",
    "playwright:test": "bun run playwright:build && playwright test",
    "playwright:test:ui": "bun run playwright:build && playwright test --ui"
  }
}
```

## Code References

- `/Users/cody/workspace/thumbwar/frontend/app/index.tsx:17-23` - Hello World screen component
- `/Users/cody/workspace/thumbwar/frontend/app/_layout.tsx:21-29` - Root layout with providers
- `/Users/cody/workspace/thumbwar/frontend/jest.config.js:1-95` - Existing Jest configuration
- `/Users/cody/workspace/thumbwar/frontend/lighthouserc.js:1-200` - Lighthouse CI configuration
- `/Users/cody/workspace/thumbwar/frontend/app.json:41-44` - Web configuration
- `/Users/cody/workspace/thumbwar/frontend/app/__tests__/index.test.tsx:1-29` - Unit test pattern
- `/Users/cody/workspace/thumbwar/frontend/app/__tests__/index.integration.test.tsx:1-60` - Integration test pattern

## Architecture Documentation

### Current Testing Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Testing Pyramid                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Lighthouse CI (Performance)             │   │
│  │              - Web performance metrics               │   │
│  │              - Static dist/ output                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ▲                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Playwright E2E (TO BE ADDED)                 │   │
│  │         - Browser-based tests                        │   │
│  │         - Static dist/ output                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ▲                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Jest Integration Tests                  │   │
│  │              - Provider stack tests                  │   │
│  │              - *.integration.test.tsx                │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ▲                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                 Jest Unit Tests                      │   │
│  │                 - Component isolation                │   │
│  │                 - *.test.tsx                         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Proposed Playwright Workflow

```
1. expo export --platform web  →  Creates dist/ directory
2. npx serve dist -l 3000     →  Serves static site
3. playwright test            →  Runs E2E tests against served site
```

## E2E Test Impact

### Existing Tests

- `/Users/cody/workspace/thumbwar/frontend/app/__tests__/index.test.tsx` - No modification needed (unit tests)
- `/Users/cody/workspace/thumbwar/frontend/app/__tests__/index.integration.test.tsx` - No modification needed (integration tests)

### Tests Requiring Modification

None - Playwright E2E tests will be new additions that complement existing tests.

### Tests to Remove

None.

### New Tests Needed

1. **`e2e/home.spec.ts`** - E2E test verifying "Hello, World!" screen
   - Verify page loads successfully
   - Verify "Hello, World!" text is visible
   - Verify page structure matches expectations

## Open Questions (Resolved below)

1. **Static output configuration**: The current `app.json` does not have `"output": "static"` in the web config. Need to verify if this is needed for the current workflow or if `expo export --platform web` works without it. <------ yes. it works witout it.

2. **CI/CD integration**: Need to determine how Playwright tests will integrate with the existing GitHub Actions workflows. <-------- Don't worry about running it in ci/cd right now.

3. **testID propagation**: Need to verify that `testID` props on Gluestack UI components (Box, Text) correctly propagate to `data-testid` in the rendered HTML. <--------- ok. verify this during implementation and adjust accordingly.

4. **Potential SDK 50+ issue**: There's a known issue where `expo export --platform web` may not terminate automatically (requires CTRL+C). This could affect CI pipelines and may need a workaround. <------ don't worry about this.

## External Sources

- [Playwright Best Practices](https://playwright.dev/docs/best-practices) - Official Playwright documentation
- [Playwright Configuration](https://playwright.dev/docs/test-configuration) - Configuration options reference
- [BrowserStack Playwright Best Practices](https://www.browserstack.com/guide/playwright-best-practices) - 15 best practices for 2026
- [Playwright Locators Guide](https://playwright.dev/docs/locators) - Selector strategies
- [Playwright getByRole](https://www.browserstack.com/guide/playwright-getbyrole) - Role-based selectors
- [Expo Static Rendering](https://docs.expo.dev/router/reference/static-rendering/) - Official Expo docs
- [Detox testID Guide](https://wix.github.io/Detox/docs/guide/test-id/) - testID best practices for React Native
- [Universal E2E Testing - Ignite Cookbook](https://ignitecookbook.com/docs/recipes/UniversalE2ETesting/) - Detox + Playwright pattern
- [Nx Expo Playwright Setup](https://emilyxiong.medium.com/add-cypress-playwright-and-storybook-to-nx-expo-apps-1d3e409ce834) - Expo + Playwright integration
- [Playwright Web Server Configuration](https://playwright.dev/docs/test-webserver) - webServer option docs
- [Testing Library Query Priority](https://dev.to/rahucode/test-id-best-practices-guide-react-typescript-nextjs-pfm) - Test ID best practices
