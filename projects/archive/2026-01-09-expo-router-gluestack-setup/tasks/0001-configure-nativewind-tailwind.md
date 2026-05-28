# Task: Configure NativeWind v4 and Tailwind CSS v3

## Applicable Skills

Invoke these skills before writing implementation code:

- `/coding-philosophy` - Always required for all code
- `/gluestack-nativewind` - This task configures NativeWind/Tailwind styling infrastructure
- `/cross-platform-compatibility` - NativeWind configuration must work on iOS, Android, and web

## Implementation Details

This task creates the foundational configuration files for NativeWind v4 with Tailwind CSS v3. These files enable Tailwind CSS styling in React Native components.

### Files to Create

1. **babel.config.js** - Babel configuration with NativeWind preset
2. **metro.config.js** - Metro bundler configuration with NativeWind integration
3. **tailwind.config.js** - Tailwind CSS configuration with NativeWind preset
4. **global.css** - Tailwind CSS directives
5. **nativewind-env.d.ts** - TypeScript type definitions for NativeWind

### Configuration Details

#### babel.config.js

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
```

#### metro.config.js

```javascript
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);
module.exports = withNativeWind(config, { input: './global.css' });
```

#### tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: { extend: {} },
  plugins: [],
};
```

#### global.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### nativewind-env.d.ts

```typescript
/// <reference types="nativewind/types" />
```

### Important Notes

- NativeWind v4 only supports Tailwind CSS v3, NOT v4
- The project already has `nativewind: ^4.2.1` and `tailwindcss: ^3.4.7` installed
- The `tsconfig.json` already references `nativewind-env.d.ts` (line 4)

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
2. **Invoke each skill listed in "Applicable Skills" above using the Skill tool** (e.g., run `/coding-philosophy`, then `/gluestack-nativewind`, then `/cross-platform-compatibility`)

Mark "Invoke skills" as completed.

### Step 2: Write Failing Tests
Mark "Write failing tests" as in_progress.

Configuration files do not require unit tests. Skip to implementation.

Mark "Write failing tests" as completed.

### Step 3: Write Implementation
Mark "Write implementation" as in_progress.

Create the following files with the configurations specified above:
1. `/Users/cody/workspace/thumbwar/frontend/babel.config.js`
2. `/Users/cody/workspace/thumbwar/frontend/metro.config.js`
3. `/Users/cody/workspace/thumbwar/frontend/tailwind.config.js`
4. `/Users/cody/workspace/thumbwar/frontend/global.css`
5. `/Users/cody/workspace/thumbwar/frontend/nativewind-env.d.ts`

Verify the configuration works by running:
```bash
bun run build
```

Mark "Write implementation" as completed.

### Step 4: Update Documentation
Mark "Update documentation" as in_progress.

Add JSDoc comments to each JavaScript configuration file explaining:
- Purpose of the file
- Key configuration options
- Links to relevant documentation

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
