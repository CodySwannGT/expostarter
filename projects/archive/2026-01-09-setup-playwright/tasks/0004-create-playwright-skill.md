# Task: Create Playwright testID Best Practices Skill

## Applicable Skills

Invoke these skills before writing implementation code:

- `/coding-philosophy` - Always required for all code
- `/skill-creator` - For creating effective skills
- `/directory-structure` - For placing the skill in the correct location

## Implementation Details

This task creates a Claude Code skill that documents best practices for adding selectors (testID, aria-labels) for Playwright E2E testing in Expo web applications.

### Skill Location

Create the skill at `.claude/skills/playwright-selectors/SKILL.md`

### Skill Content

The skill should document:

1. **Selector Priority** (from Playwright docs)
   - `getByRole` - accessibility-first, most recommended
   - `getByText` - for visible text content
   - `getByLabel` - for form elements with labels
   - `getByTestId` - fallback for elements without semantic selectors

2. **testID Naming Convention**
   - Use namespaced pattern: `screen:element` (e.g., `home:title`, `profile:avatar`)
   - Use lowercase with colons as separators
   - Be descriptive but concise

3. **React Native to HTML Mapping**
   - `testID` prop renders as `data-testid` in HTML on web
   - Playwright's `getByTestId()` uses `data-testid` by default
   - This provides cross-platform compatibility

4. **Accessibility Best Practices**
   - Prefer semantic selectors (`getByRole`) over testID when possible
   - Use `aria-label` for accessibility, not just testing
   - Keep aria-labels meaningful for screen reader users

5. **When to Add testID**
   - Add to interactive elements that will be targeted by E2E tests
   - Add to key structural containers for page verification
   - Don't add testID to every element - only those needed for testing

6. **Gluestack UI Specifics**
   - Verify testID propagation on Gluestack components
   - Document any components that require special handling

### Skill Metadata

```yaml
---
name: playwright-selectors
description: Best practices for adding testID and aria-label selectors for Playwright E2E testing in Expo web applications. Use this skill when adding E2E test coverage, creating new components that need test selectors, or reviewing code for testability.
---
```

## Implementation Steps

### Step 0: Setup Tracking
Use TodoWrite to create task tracking todos:
- Invoke skills
- Create skill directory
- Write skill content
- Validate skill format
- Commit changes

### Step 1: Invoke Skills
Mark "Invoke skills" as in_progress.

1. Mark this task as "in progress" in the corresponding `progress.md` file
2. **Invoke each skill listed in "Applicable Skills" above using the Skill tool** (run `/coding-philosophy`, `/skill-creator`, `/directory-structure`)

Mark "Invoke skills" as completed.

### Step 2: Create Skill Directory
Mark "Create skill directory" as in_progress.

Create the directory `.claude/skills/playwright-selectors/`

Mark "Create skill directory" as completed.

### Step 3: Write Skill Content
Mark "Write skill content" as in_progress.

Create the SKILL.md file with comprehensive documentation based on:
- Research findings from `research.md`
- Implementation learnings from previous tasks
- Official Playwright documentation patterns

Mark "Write skill content" as completed.

### Step 4: Validate Skill Format
Mark "Validate skill format" as in_progress.

Ensure the skill follows the format established by other skills in `.claude/skills/`:
- YAML frontmatter with name and description
- Clear section headers
- Actionable guidance
- Code examples

Mark "Validate skill format" as completed.

### Step 5: Commit Changes
Mark "Commit changes" as in_progress.

1. Run /git:commit
2. Fix any errors that blocked the commit
3. Mark this task as "completed" in the corresponding `progress.md` file
4. Write any findings you learned about the project to the `findings.md` file

Mark "Commit changes" as completed.

## Implementation Rules

### Always

- Follow TDD (skill creation is documentation, not code)
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
