# Task: Install Playwright and Configure the Project

## Applicable Skills

Invoke these skills before writing implementation code:

- `/coding-philosophy` - Always required for all code
- `/directory-structure` - For proper file placement of configuration files

## Implementation Details

This task installs Playwright and its dependencies, creates the configuration file, and adds npm scripts to package.json.

### Dependencies to Install

Install Playwright as a dev dependency using bun:

```bash
bun add -d @playwright/test
```

Then install the browser binaries:

```bash
bunx playwright install
```

### Playwright Configuration

Create `playwright.config.ts` at the project root with the following configuration:

```typescript
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

### NPM Scripts to Add

Add these scripts to package.json:

```json
{
  "scripts": {
    "playwright:build": "expo export --platform web",
    "playwright:test": "bun run playwright:build && playwright test",
    "playwright:test:ui": "bun run playwright:build && playwright test --ui"
  }
}
```

### ESLint Configuration Updates

Add to the ignores array in `eslint.config.mjs`:

```javascript
"e2e/**",
"playwright-report/**",
```

Note: The `e2e/**` ignore is already present. The `playwright-report/**` ignore is also present. Verify these exist.

### Create E2E Directory

Create the `e2e/` directory at the project root to house Playwright tests.

## Implementation Steps

### Step 0: Setup Tracking
Use TodoWrite to create task tracking todos:
- Invoke skills
- Install Playwright dependencies
- Create Playwright configuration
- Add npm scripts to package.json
- Verify ESLint ignores
- Create e2e directory
- Commit changes

### Step 1: Invoke Skills
Mark "Invoke skills" as in_progress.

1. Mark this task as "in progress" in the corresponding `progress.md` file
2. **Invoke each skill listed in "Applicable Skills" above using the Skill tool** (run `/coding-philosophy`, then `/directory-structure`)

Mark "Invoke skills" as completed.

### Step 2: Install Dependencies
Mark "Install Playwright dependencies" as in_progress.

Run the following commands:

```bash
bun add -d @playwright/test
bunx playwright install
```

Mark "Install Playwright dependencies" as completed.

### Step 3: Create Configuration
Mark "Create Playwright configuration" as in_progress.

Create `playwright.config.ts` at the project root with the configuration shown above.

Mark "Create Playwright configuration" as completed.

### Step 4: Add NPM Scripts
Mark "Add npm scripts to package.json" as in_progress.

Add the playwright scripts to package.json.

Mark "Add npm scripts to package.json" as completed.

### Step 5: Verify ESLint Ignores
Mark "Verify ESLint ignores" as in_progress.

Verify that `e2e/**` and `playwright-report/**` are in the ignores array of `eslint.config.mjs`.

Mark "Verify ESLint ignores" as completed.

### Step 6: Create E2E Directory
Mark "Create e2e directory" as in_progress.

Create the `e2e/` directory at the project root.

Mark "Create e2e directory" as completed.

### Step 7: Commit Changes
Mark "Commit changes" as in_progress.

1. Run /git:commit
2. Fix any errors that blocked the commit
3. Mark this task as "completed" in the corresponding `progress.md` file
4. Write any findings you learned about the project to the `findings.md` file

Mark "Commit changes" as completed.

## Implementation Rules

### Always

- Follow TDD (though this task is configuration, not code)
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
