# Task: Add testID Attributes to Hello World Screen

## Applicable Skills

Invoke these skills before writing implementation code:

- `/coding-philosophy` - Always required for all code
- `/cross-platform-compatibility` - testID works across iOS, Android, and web
- `/gluestack-nativewind` - When modifying Gluestack UI components

## Implementation Details

This task adds testID attributes to the Hello World screen component at `app/index.tsx` to enable E2E testing with Playwright.

### Current Component (from research.md)

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

### Target Component

Add testID attributes following the namespaced pattern `screen:element`:

```typescript
export default function Index(): React.JSX.Element {
  return (
    <Box testID="home:container" className="flex-1 items-center justify-center bg-white">
      <Text testID="home:title" className="text-2xl font-bold text-gray-900">Hello, World!</Text>
    </Box>
  );
}
```

### testID to data-testid Mapping

Per the research:
- React Native's `testID` prop renders as `data-testid` in HTML on web
- Playwright's `getByTestId()` locator uses `data-testid` by default
- This provides cross-platform compatibility

### Existing Tests

Check that the existing unit tests at `app/__tests__/index.test.tsx` and `app/__tests__/index.integration.test.tsx` still pass after adding testID attributes. The testID attribute should not affect test behavior.

## Implementation Steps

### Step 0: Setup Tracking
Use TodoWrite to create task tracking todos:
- Invoke skills
- Read current component
- Add testID attributes
- Verify unit tests pass
- Update preamble documentation
- Commit changes

### Step 1: Invoke Skills
Mark "Invoke skills" as in_progress.

1. Mark this task as "in progress" in the corresponding `progress.md` file
2. **Invoke each skill listed in "Applicable Skills" above using the Skill tool** (run `/coding-philosophy`, `/cross-platform-compatibility`, `/gluestack-nativewind`)

Mark "Invoke skills" as completed.

### Step 2: Read Current Component
Mark "Read current component" as in_progress.

Read the current `app/index.tsx` file to understand the exact structure.

Mark "Read current component" as completed.

### Step 3: Add testID Attributes
Mark "Add testID attributes" as in_progress.

Add testID attributes to the Box and Text components:
- `testID="home:container"` on the Box
- `testID="home:title"` on the Text

Mark "Add testID attributes" as completed.

### Step 4: Verify Unit Tests Pass
Mark "Verify unit tests pass" as in_progress.

Run the existing unit and integration tests to ensure they still pass:

```bash
bun run test:unit
bun run test:integration
```

Mark "Verify unit tests pass" as completed.

### Step 5: Update Preamble Documentation
Mark "Update preamble documentation" as in_progress.

Update the JSDoc preamble on the Index component to document the testID attributes.

Mark "Update preamble documentation" as completed.

### Step 6: Commit Changes
Mark "Commit changes" as in_progress.

1. Run /git:commit
2. Fix any errors that blocked the commit
3. Mark this task as "completed" in the corresponding `progress.md` file
4. Write any findings you learned about the project to the `findings.md` file

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
