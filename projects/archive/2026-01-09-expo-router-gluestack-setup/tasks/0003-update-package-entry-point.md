# Task: Update package.json Entry Point for Expo Router

## Applicable Skills

Invoke these skills before writing implementation code:

- `/coding-philosophy` - Always required for all code
- `/expo-router-best-practices` - This task configures the Expo Router entry point

## Implementation Details

This task updates the `package.json` main field to use the Expo Router entry point. This is a required configuration for Expo Router to work properly.

### Current State

```json
{
  "main": "index"
}
```

### Required State

```json
{
  "main": "expo-router/entry"
}
```

### Why This Change Is Needed

Expo Router requires the `expo-router/entry` entry point to:
1. Initialize the file-based routing system
2. Set up the navigation container automatically
3. Handle deep linking and URL routing
4. Integrate with React Navigation

### File to Modify

- `/Users/cody/workspace/thumbwar/frontend/package.json` - Update `main` field from `"index"` to `"expo-router/entry"`

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
2. **Invoke each skill listed in "Applicable Skills" above using the Skill tool** (e.g., run `/coding-philosophy`, then `/expo-router-best-practices`)

Mark "Invoke skills" as completed.

### Step 2: Write Failing Tests
Mark "Write failing tests" as in_progress.

Configuration changes to package.json do not require unit tests. Skip to implementation.

Mark "Write failing tests" as completed.

### Step 3: Write Implementation
Mark "Write implementation" as in_progress.

1. Read the current `/Users/cody/workspace/thumbwar/frontend/package.json` file
2. Update the `main` field from `"index"` to `"expo-router/entry"`
3. Verify the change by running:
```bash
bun run build
```

Mark "Write implementation" as completed.

### Step 4: Update Documentation
Mark "Update documentation" as in_progress.

No additional documentation needed for package.json changes.

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
