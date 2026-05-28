# Task: Create E2E Test for Hello World Screen

## Applicable Skills

Invoke these skills before writing implementation code:

- `/coding-philosophy` - Always required for all code
- `/directory-structure` - For placing tests in the correct e2e/ directory

## Implementation Details

This task creates the first Playwright E2E test that verifies the Hello World screen renders correctly in a browser.

### Test File Location

Create the test at `e2e/home.spec.ts` (per the research.md directory structure recommendation).

### Test Implementation

```typescript
/**
 * @file E2E tests for the home screen
 * @description Verifies the Hello World screen renders correctly in browser
 */
import { test, expect } from '@playwright/test';

test.describe('Home Screen', () => {
  test('displays Hello, World! text', async ({ page }) => {
    await page.goto('/');

    // Verify the page loaded successfully
    await expect(page).toHaveTitle(/.*Thumbwar.*/i);

    // Verify the Hello, World! text is visible using testID
    const title = page.getByTestId('home:title');
    await expect(title).toBeVisible();
    await expect(title).toHaveText('Hello, World!');
  });

  test('renders the home container', async ({ page }) => {
    await page.goto('/');

    // Verify the container element exists
    const container = page.getByTestId('home:container');
    await expect(container).toBeVisible();
  });
});
```

### Test Selector Strategy

Per the research, use this priority:
1. `getByRole` - accessibility-first (most recommended)
2. `getByText` - for visible text content
3. `getByTestId` - fallback for elements without semantic selectors

For this test, we use `getByTestId` because:
- The Hello World text is in a `<Text>` component which renders as a `<div>` on web (not a semantic element)
- The testID provides a stable selector that won't break if text changes
- This demonstrates the testID pattern for future tests

### Alternative Using getByText

If testID verification fails during implementation, the test can fall back to:

```typescript
await expect(page.getByText('Hello, World!')).toBeVisible();
```

## Implementation Steps

### Step 0: Setup Tracking
Use TodoWrite to create task tracking todos:
- Invoke skills
- Write failing E2E test
- Build the web export
- Run E2E test to verify it passes
- Update documentation
- Commit changes

### Step 1: Invoke Skills
Mark "Invoke skills" as in_progress.

1. Mark this task as "in progress" in the corresponding `progress.md` file
2. **Invoke each skill listed in "Applicable Skills" above using the Skill tool** (run `/coding-philosophy`, `/directory-structure`)

Mark "Invoke skills" as completed.

### Step 2: Write Failing E2E Test
Mark "Write failing E2E test" as in_progress.

Create the E2E test file at `e2e/home.spec.ts` with the implementation shown above.

Note: This follows TDD - the test is written first. It will initially fail until the web export is built.

Mark "Write failing E2E test" as completed.

### Step 3: Build Web Export
Mark "Build the web export" as in_progress.

Build the web export to create the dist/ directory:

```bash
bun run playwright:build
```

Or if the script isn't available yet:

```bash
expo export --platform web
```

Mark "Build the web export" as completed.

### Step 4: Run E2E Test
Mark "Run E2E test to verify it passes" as in_progress.

Run the Playwright tests to verify they pass:

```bash
bunx playwright test
```

If tests fail due to testID not propagating, adjust the selectors as needed and document the findings.

Mark "Run E2E test to verify it passes" as completed.

### Step 5: Update Documentation
Mark "Update documentation" as in_progress.

Add JSDoc preamble to the test file documenting its purpose.

Mark "Update documentation" as completed.

### Step 6: Commit Changes
Mark "Commit changes" as in_progress.

1. Run /git:commit
2. Fix any errors that blocked the commit
3. Mark this task as "completed" in the corresponding `progress.md` file
4. Write any findings you learned about the project to the `findings.md` file (especially about testID propagation)

Mark "Commit changes" as completed.

## Implementation Rules

### Always

- Follow TDD
- Figure out the Package manager the project uses: bun
- Read @package.json
- Create clear documentation preambles with JSDoc for new code
- Update preambles when updating or modifying code

### Never

- Partially implement code or leave something as a "note" or "TODO" for later.
- Skip any git hooks even if you think they're unrelated
- Skip or disable any tests or quality checks.
- Add .skip to a test unless explicitly asked to
- Directly modify a file in node_modules/
- Use --no-verify with git commands.
- Make assumptions about whether something worked. Test it empirically to confirm.
- Cover up bugs or issues. Always fix them properly.
- Write functions or methods unless they are needed.
- Say "not related to our changes" or "not relevant to this task". Always provide a solution.
- Create functions or variables with versioned names (processV2, handleNew, ClientOld)
- Write unhelpful comments like "removed code"
- Disable a lint rule unless absolutely necessary
