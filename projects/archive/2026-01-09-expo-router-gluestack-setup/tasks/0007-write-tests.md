# Task: Write Unit and Integration Tests for Index Route

## Applicable Skills

Invoke these skills before writing implementation code:

- `/coding-philosophy` - Always required for all code
- `/testing-library` - This task writes unit and integration tests
- `/expo-router-best-practices` - This task tests Expo Router routes

## Implementation Details

This task writes comprehensive unit and integration tests for the index route to achieve 98% coverage.

### Test Files to Create

1. **Unit Test**: `/Users/cody/workspace/thumbwar/frontend/__tests__/app/index.test.tsx`
2. **Integration Test**: `/Users/cody/workspace/thumbwar/frontend/__tests__/app/index.integration.test.tsx`

### Unit Test Requirements

Test the Index component in isolation:
- Renders without errors
- Displays "Hello, World!" text
- Has correct styling (centered content)
- Uses Gluestack UI components

### Integration Test Requirements

Test the Index route with Expo Router:
- Route renders at `/` pathname
- Navigation state is correct
- Component integrates with GluestackUIProvider

### Test Structure

#### Unit Test (`__tests__/app/index.test.tsx`)

```typescript
/**
 * Unit tests for the Index route component.
 * Tests component rendering in isolation.
 * @module __tests__/app/index.test
 */
import { render, screen } from "@testing-library/react-native";
import Index from "@/app/index";

describe("Index", () => {
  describe("rendering", () => {
    it("renders without crashing", () => {
      expect(() => render(<Index />)).not.toThrow();
    });

    it("displays Hello, World! text", () => {
      render(<Index />);
      expect(screen.getByText("Hello, World!")).toBeTruthy();
    });

    it("renders a container element", () => {
      render(<Index />);
      expect(screen.getByText("Hello, World!").parent).toBeTruthy();
    });
  });
});
```

#### Integration Test (`__tests__/app/index.integration.test.tsx`)

```typescript
/**
 * Integration tests for the Index route.
 * Tests route rendering with Expo Router.
 * @module __tests__/app/index.integration.test
 */
import { renderRouter, screen } from "expo-router/testing-library";
import Index from "@/app/index";

describe("Index Route Integration", () => {
  it("renders at root pathname", async () => {
    renderRouter(
      {
        index: Index,
      },
      {
        initialUrl: "/",
      }
    );

    expect(screen).toHavePathname("/");
  });

  it("displays Hello, World! text through router", async () => {
    renderRouter(
      {
        index: Index,
      },
      {
        initialUrl: "/",
      }
    );

    expect(screen.getByText("Hello, World!")).toBeTruthy();
  });
});
```

### Testing Best Practices (from testing-library skill)

1. **Query Priority**: Use `getByText`, `getByRole`, `getByLabelText` over `getByTestId`
2. **User-Centric**: Test what users see and interact with
3. **Avoid Implementation Details**: Don't test internal state or methods
4. **Async Handling**: Use `findBy*` for async operations
5. **Accessibility**: Prefer queries that enforce accessibility

### Coverage Requirements

The tests must achieve 98% coverage on:
- Statements
- Branches
- Functions
- Lines

### Important Notes

- Test files use `__tests__/` directory structure, NOT in `app/` directory
- Integration tests use `expo-router/testing-library`
- Unit tests mock expo-router (configured in `jest.setup.js`)
- The `*.integration.test.tsx` pattern is used for integration tests

### Dependencies

This task depends on:
- Task 0002 (Jest configuration) - for test infrastructure
- Task 0004 (Root layout) - for layout wrapper
- Task 0005 (Index route) - for component to test

## Implementation Steps

### Step 0: Setup Tracking
Use TodoWrite to create task tracking todos:
- Invoke skills
- Write failing tests
- Write implementation
- Update documentation
- Commit changes

**CRITICAL**: DO NOT STOP until all todos are marked completed.

### Step 1: Invoke Skills
Mark "Invoke skills" as in_progress.

1. Mark this task as "in progress" in the corresponding `progress.md` file
2. **Invoke each skill listed in "Applicable Skills" above using the Skill tool** (e.g., run `/coding-philosophy`, then `/testing-library`, then `/expo-router-best-practices`)

Mark "Invoke skills" as completed.

### Step 2: Write Failing Tests
Mark "Write failing tests" as in_progress.

1. Create the `__tests__/app/` directory structure
2. Write unit tests in `__tests__/app/index.test.tsx`
3. Write integration tests in `__tests__/app/index.integration.test.tsx`
4. Run tests to verify they work with the existing implementation:
```bash
bun run test:unit
bun run test:integration
```

Mark "Write failing tests" as completed.

### Step 3: Write Implementation
Mark "Write implementation" as in_progress.

Tests should pass with the existing Index component from task 0005. If tests fail:
1. Debug and fix the test assertions
2. Update the Index component if needed to make tests pass
3. Ensure coverage meets 98% threshold

Verify coverage:
```bash
bun run test:cov
```

Mark "Write implementation" as completed.

### Step 4: Update Documentation
Mark "Update documentation" as in_progress.

Ensure JSDoc preambles in test files include:
- Module description
- Purpose of tests
- Test categories (rendering, behavior, etc.)

Mark "Update documentation" as completed.

### Step 5: Commit Changes
Mark "Commit changes" as in_progress.

1. run /git:commit
2. Fix any errors that blocked the commit
3. Mark this task as "completed" in the corresponding `progress.md` file
4. Write any findings you learned about the project to the `findings.md` file

Mark "Commit changes" as completed.

## Implementation Rules

### Always

- Follow TDD
- figure out the Package manager the project uses: bun
- read @package.json
- create clear documentation preambles with JSDoc for new code
- update preambles when updating or modifying code

### Never

- Partially implement code or leave something as a "note" or "TODO" for later.
- skip any git hooks even if you think they're unrelated
- skip or disable any tests or quality checks.
- add .skip to a test unless explicitly asked to
- directly modify a file in node_modules/
- use --no-verify with git commands.
- make assumptions about whether something worked. Test it empirically to confirm.
- cover up bugs or issues. Always fix them properly.
- write functions or methods unless they are needed.
- say "not related to our changes" or "not relevant to this task". Always provide a solution.
- create functions or variables with versioned names (processV2, handleNew, ClientOld)
- write unhelpful comments like "removed code"
- disable a lint rule unless absolutely necessary
