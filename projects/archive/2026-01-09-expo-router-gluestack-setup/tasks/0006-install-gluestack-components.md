# Task: Install Gluestack UI Components

## Applicable Skills

Invoke these skills before writing implementation code:

- `/coding-philosophy` - Always required for all code
- `/gluestack-nativewind` - This task installs Gluestack UI components
- `/directory-structure` - This task creates files in the components/ui/ directory

## Implementation Details

This task installs all Gluestack UI v3 components using the official CLI. The CLI automatically generates component files in the `components/ui/` directory.

### CLI Commands

```bash
# Initialize Gluestack UI (creates GluestackUIProvider and essential components)
npx gluestack-ui init

# Add all commonly used components
npx gluestack-ui add box text pressable button input icon heading vstack hstack center badge avatar card checkbox radio slider switch textarea toast alert modal drawer accordion menu popover tooltip
```

### Generated Files

The CLI will generate files in:
- `/Users/cody/workspace/thumbwar/frontend/components/ui/` - All UI components

Key components that will be generated:
- `gluestack-ui-provider/` - Provider for theming
- `box/` - Container component (replaces View)
- `text/` - Text component
- `pressable/` - Pressable component (replaces TouchableOpacity)
- `button/` - Button component
- `input/` - Input component
- `icon/` - Icon component
- `heading/` - Heading component
- `vstack/` - Vertical stack layout
- `hstack/` - Horizontal stack layout
- `center/` - Centered layout
- And many more...

### Component Architecture

Gluestack v3 uses:
- `@gluestack-ui/core` - Core component creators
- `@gluestack-ui/utils` - Utility functions including NativeWind utilities

Components are generated as source files (not npm dependencies), allowing customization.

### Important Notes

- The project already has `@gluestack-ui/core: ^3.0.10` and `@gluestack-ui/utils: ^3.0.7` installed
- Generated components in `components/ui/` are excluded from ESLint and test coverage
- The CLI may prompt for configuration options - use defaults for Expo with NativeWind
- After installation, update `app/_layout.tsx` to import `GluestackUIProvider`

### Dependencies

This task should be completed before:
- Task 0004 needs GluestackUIProvider
- Task 0005 needs Box and Text components

**Recommendation**: Run this task early in the project implementation.

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
2. **Invoke each skill listed in "Applicable Skills" above using the Skill tool** (e.g., run `/coding-philosophy`, then `/gluestack-nativewind`, then `/directory-structure`)

Mark "Invoke skills" as completed.

### Step 2: Write Failing Tests
Mark "Write failing tests" as in_progress.

Generated Gluestack UI components are excluded from testing (they are third-party code). No tests needed.

Mark "Write failing tests" as completed.

### Step 3: Write Implementation
Mark "Write implementation" as in_progress.

1. Run the Gluestack CLI to initialize:
```bash
npx gluestack-ui init
```

2. When prompted, select:
   - Framework: Expo
   - Styling: NativeWind
   - TypeScript: Yes
   - Components directory: components/ui

3. Add all commonly used components:
```bash
npx gluestack-ui add box text pressable button input icon heading vstack hstack center badge avatar card checkbox radio slider switch textarea toast alert modal drawer accordion menu popover tooltip scroll-view image divider spinner progress actionsheet fab link select
```

4. Verify the components are generated in `components/ui/`

5. Update `app/_layout.tsx` to import the generated `GluestackUIProvider`:
```typescript
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
```

6. Verify the build succeeds:
```bash
bun run build
```

Mark "Write implementation" as completed.

### Step 4: Update Documentation
Mark "Update documentation" as in_progress.

The generated components come with their own documentation. No additional documentation needed.

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
