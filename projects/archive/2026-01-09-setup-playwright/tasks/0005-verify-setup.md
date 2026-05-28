# Task: Verify Setup and Document Verification Command

## Applicable Skills

Invoke these skills before writing implementation code:

- `/coding-philosophy` - Always required for all code

## Implementation Details

This task verifies the complete Playwright setup works correctly and documents the verification command for code reviewers.

### Verification Command

Per the research.md, the verification command should be:

```bash
bun run playwright:test
```

This command:
1. Builds the web export (`expo export --platform web`)
2. Runs Playwright tests against the built output
3. Outputs test results

### Verification Steps

1. Run the verification command
2. Confirm all tests pass
3. Document any issues encountered and their resolutions
4. Update the project README or findings with the verification command

### Expected Output

```
Running 6 tests using 3 workers (3 browsers x 2 tests)
  6 passed
```

### Troubleshooting

If tests fail, check:
- The dist/ directory was created by the build
- The serve command is available (install if needed: `bun add -d serve`)
- The testID attributes are correctly propagating to data-testid
- Browser binaries are installed (`bunx playwright install`)

## Implementation Steps

### Step 0: Setup Tracking
Use TodoWrite to create task tracking todos:
- Invoke skills
- Run verification command
- Document results in findings.md
- Update progress.md to mark project complete
- Commit changes

### Step 1: Invoke Skills
Mark "Invoke skills" as in_progress.

1. Mark this task as "in progress" in the corresponding `progress.md` file
2. **Invoke each skill listed in "Applicable Skills" above using the Skill tool** (run `/coding-philosophy`)

Mark "Invoke skills" as completed.

### Step 2: Run Verification Command
Mark "Run verification command" as in_progress.

Run the complete verification command:

```bash
bun run playwright:test
```

This single command should:
1. Build the web export
2. Start the serve process
3. Run all Playwright tests
4. Report results

Capture the output and verify all tests pass.

Mark "Run verification command" as completed.

### Step 3: Document Results
Mark "Document results in findings.md" as in_progress.

Update `findings.md` with:
- The verification command (`bun run playwright:test`)
- Test results and pass/fail status
- Any issues encountered and their resolutions
- testID propagation behavior observed
- Any other learnings about Playwright + Expo integration

Mark "Document results in findings.md" as completed.

### Step 4: Update Progress
Mark "Update progress.md to mark project complete" as in_progress.

Update `progress.md` to mark all tasks as completed.

Mark "Update progress.md to mark project complete" as completed.

### Step 5: Commit Changes
Mark "Commit changes" as in_progress.

1. Run /git:commit
2. Fix any errors that blocked the commit
3. Verify the final state is clean and all tests pass

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
