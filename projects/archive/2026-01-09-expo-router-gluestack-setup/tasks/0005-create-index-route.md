# Task: Create Index Route Displaying "Hello, World!"

## Applicable Skills

Invoke these skills before writing implementation code:

- `/coding-philosophy` - Always required for all code
- `/expo-router-best-practices` - This task creates a route in the app/ directory
- `/gluestack-nativewind` - This task uses Gluestack UI components for styling
- `/container-view-pattern` - This task creates a React component
- `/directory-structure` - This task creates files in the app/ directory
- `/cross-platform-compatibility` - Component must work on iOS, Android, and web
- `/testing-library` - Tests will be written for this component

## Implementation Details

This task creates the index route (`app/index.tsx`) which displays "Hello, World!" using Gluestack UI components.

### File to Create

- `/Users/cody/workspace/thumbwar/frontend/app/index.tsx`

### Route Requirements

The index route must:
1. Display "Hello, World!" text prominently
2. Use Gluestack UI components (`Box`, `Text`) instead of React Native primitives
3. Center the content on the screen
4. Follow the Container/View pattern (though for this simple component, a single file is acceptable)

### Expected Structure

```typescript
/**
 * Index route for the application.
 * Displays a simple "Hello, World!" greeting using Gluestack UI components.
 * @module app/index
 */
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";

/**
 * Index screen component that displays "Hello, World!".
 * @returns The index screen with centered greeting text.
 */
export default function Index(): JSX.Element {
  return (
    <Box className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold text-gray-900">Hello, World!</Text>
    </Box>
  );
}
```

### Component Mapping (from Gluestack skill)

| React Native | Gluestack Equivalent |
|--------------|---------------------|
| `View` | `Box` from `@/components/ui/box` |
| `Text` | `Text` from `@/components/ui/text` |

### Important Notes

- The `app/` directory is reserved for routes only
- This is a simple component that doesn't require Container/View splitting
- Gluestack components will be available after task 0006 (Gluestack installation)
- If Gluestack is not yet installed, use React Native primitives with className and note it will be updated

### Dependencies

This task depends on:
- Task 0004 (Root layout) - for the layout wrapper
- Task 0006 (Gluestack installation) - for Gluestack UI components

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

Create unit tests for the index route:
- `/Users/cody/workspace/thumbwar/frontend/__tests__/app/index.test.tsx`

```typescript
import { render, screen } from "@testing-library/react-native";
import Index from "@/app/index";

describe("Index Route", () => {
  it("renders Hello, World! text", () => {
    render(<Index />);
    expect(screen.getByText("Hello, World!")).toBeTruthy();
  });
});
```

Run the test to verify it fails (component doesn't exist yet):
```bash
bun run test:unit
```

Mark "Write failing tests" as completed.

### Step 3: Write Implementation
Mark "Write implementation" as in_progress.

1. Create `/Users/cody/workspace/thumbwar/frontend/app/index.tsx` with the component structure
2. Run tests to verify they pass:
```bash
bun run test:unit
```
3. Verify the build succeeds:
```bash
bun run build
```

Mark "Write implementation" as completed.

### Step 4: Update Documentation
Mark "Update documentation" as in_progress.

Ensure the JSDoc preamble includes:
- Module description
- Component purpose
- Any props (none for this simple component)

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
