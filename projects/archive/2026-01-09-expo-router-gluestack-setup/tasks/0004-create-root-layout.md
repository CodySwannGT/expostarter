# Task: Create Root Layout with Providers

## Applicable Skills

Invoke these skills before writing implementation code:

- `/coding-philosophy` - Always required for all code
- `/expo-router-best-practices` - This task creates the root layout for Expo Router
- `/gluestack-nativewind` - This task uses GluestackUIProvider
- `/container-view-pattern` - This task creates a React component (layout)
- `/directory-structure` - This task creates files in the app/ directory
- `/cross-platform-compatibility` - Layout must work on iOS, Android, and web

## Implementation Details

This task creates the root layout file (`app/_layout.tsx`) which serves as the entry point for Expo Router and wraps all routes with required providers.

### File to Create

- `/Users/cody/workspace/thumbwar/frontend/app/_layout.tsx`

### Layout Requirements

The root layout must:
1. Wrap all routes with `GluestackUIProvider` for Gluestack UI theming
2. Wrap all routes with `SafeAreaProvider` for safe area insets
3. Import the `global.css` file for NativeWind/Tailwind styles
4. Export a `Stack` navigator as the root navigation structure
5. Handle splash screen hiding after fonts load (if applicable)

### Expected Structure

```typescript
/**
 * Root layout for Expo Router application.
 * Provides GluestackUIProvider and SafeAreaProvider to all routes.
 * @module app/_layout
 */
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

/**
 * Root layout component that wraps all routes with necessary providers.
 * @returns The root layout with Stack navigator and providers.
 */
export default function RootLayout(): JSX.Element {
  return (
    <SafeAreaProvider>
      <GluestackUIProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}
```

### Important Notes

- The `app/` directory is reserved for routes only - no component files
- The root layout replaces the traditional `App.tsx` file
- All initialization code (fonts, splash screen, providers) goes in `_layout.tsx`
- The `GluestackUIProvider` will be available after task 0006 (Gluestack installation)
- If `GluestackUIProvider` is not yet available, create a placeholder that can be updated

### Dependencies

This task depends on:
- Task 0001 (NativeWind/Tailwind configuration) - for `global.css` import
- Task 0006 (Gluestack installation) - for `GluestackUIProvider`

If Gluestack is not yet installed, use a minimal layout structure and note that it will be updated in task 0006.

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
2. **Invoke each skill listed in "Applicable Skills" above using the Skill tool** (e.g., run `/coding-philosophy`, then `/expo-router-best-practices`, then `/gluestack-nativewind`, etc.)

Mark "Invoke skills" as completed.

### Step 2: Write Failing Tests
Mark "Write failing tests" as in_progress.

Layout files typically don't have direct unit tests as they are tested through integration tests of the routes they contain. However, you should verify the layout renders without errors.

Create a basic smoke test:
- `/Users/cody/workspace/thumbwar/frontend/__tests__/app/_layout.test.tsx`

```typescript
import { render } from "@testing-library/react-native";
import RootLayout from "@/app/_layout";

describe("RootLayout", () => {
  it("renders without crashing", () => {
    expect(() => render(<RootLayout />)).not.toThrow();
  });
});
```

Mark "Write failing tests" as completed.

### Step 3: Write Implementation
Mark "Write implementation" as in_progress.

1. Create the `app/` directory if it doesn't exist
2. Create `/Users/cody/workspace/thumbwar/frontend/app/_layout.tsx` with the layout structure
3. Verify the layout works by running:
```bash
bun run build
bun run test
```

Mark "Write implementation" as completed.

### Step 4: Update Documentation
Mark "Update documentation" as in_progress.

Ensure the JSDoc preamble includes:
- Module description
- Purpose of each provider
- Links to Expo Router documentation

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
