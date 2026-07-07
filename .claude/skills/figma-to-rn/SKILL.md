---
name: figma-to-rn
description: Convert Figma designs to production-ready React Native components using GlueStack UI + NativeWind. Uses screenshot-first approach with reference component anchoring for high-fidelity output. This skill should be used when implementing UI from Figma URLs, converting Figma sections to RN code, or when the user shares a figma.com URL and wants a component built from it.
---

# Figma to React Native

## Overview

Converts Figma designs into production-ready React Native components using this project's stack: the design-library atom layer (`@/components/atoms`, wrapping vendored GlueStack UI v3), NativeWind v4 with the closed token vocabulary, the Container/View pattern, and lucide-react-native icons.

The key insight: `get_design_context` alone produces inaccurate layouts because it returns React web code. This skill uses a **screenshot-first** approach where the visual reference drives the implementation, not the generated code.

## When to Use

- User shares a Figma URL and wants it implemented
- User says "implement this design", "build this screen", "convert this from Figma"
- User pastes a `figma.com/design/...` URL
- User references a Figma frame, section, or component

## Workflow

### Phase 1: Gather Context (parallel)

Run these Figma MCP calls in parallel:

1. **`get_screenshot`** — The PRIMARY reference. This is what the output must look like.
2. **`get_design_context`** — SECONDARY reference. Use for structure hints (hierarchy, text content, spacing values), but DO NOT copy the generated React/HTML code.

Parse the Figma URL to extract `fileKey` and `nodeId`:
- `figma.com/design/:fileKey/:fileName?node-id=:nodeId` — convert `-` to `:` in nodeId
- `figma.com/design/:fileKey/branch/:branchKey/:fileName` — use branchKey as fileKey

### Phase 2: Find Reference Component

Search the codebase for the most visually/structurally similar existing component:

```bash
# Search by component type (modal, card, list, form, etc.)
# Look in the same feature directory first, then shared components
```

**Priority order for reference search:**
1. Same feature directory (`features/{feature}/components/`)
2. Shared components (`components/`)
3. Other feature directories

The reference component anchors the output to proven project patterns — correct imports, styling conventions, theme handling, and Container/View structure.

### Phase 3: Translate Design to Code

Using the screenshot as the visual target and the reference component as the code pattern:

#### 3a. Create the View file

Map Figma elements to design-library atoms (`@/components/atoms` — NEVER
`@/components/ui` or raw react-native primitives; both are lint errors). If
an element has no matching atom/variant/token, STOP and run the
**add-design-library-item** skill first:

- **Frames** → `Stack` (direction="vertical"/"horizontal") or `Box`
- **Text** → `Text` / `Heading` atoms with a `variant` from the ratified type scale
- **Buttons** → `Button` atom (closed `variant`/`tone`/`size` enums)
- **Inputs** → `Input` atom
- **Icons** → `lucide-react-native` passed to the `Icon` atom
- **Images** → Download from MCP localhost URLs, store in `assets/`

**Styling rules:**
- Style atoms with the closed className vocabulary only:
  `className="items-center p-4"` plus parent `Stack space` for gaps
- Map Figma colors to the semantic tier (`content-*`, `surface-*`,
  `accent-primary`, `status-*`, `outline-*`) — check `tailwind.config.js`
- Map Figma spacing to the closed scale: 4px=1, 8px=2, 12px=3, 16px=4 …
  (off-scale values snap; ties round down)
- Map Figma font sizes to text-style variants (`caption`, `body`,
  `title-sm`, `title`, `display-*`) — not raw `text-*` size classes
- For dark mode: semantic tokens are CSS-var driven, so both themes come
  free — never hardcode a per-theme color
- **NEVER use `<div>`, `<span>`, or web-only CSS properties**
- **NEVER use hardcoded hex colors or arbitrary `[...]` values** — both are lint errors

**Layout fidelity checklist:**
- Match flex direction (row vs column) from screenshot
- Match alignment (start, center, end, space-between)
- Match gap/spacing between elements
- Match padding inside containers
- Match border radius values
- Match text alignment and truncation
- Match icon sizes and positions

#### 3b. Create the Container file

Extract all logic from the View:
- State management (`useState`, `useMemo`, `useCallback`)
- Data fetching (`useQuery`)
- Event handlers
- Theme resolution (`useTheme`)
- Navigation (`useRouter`)

Container passes only primitive props and callbacks to View.

#### 3c. Create the barrel export

```typescript
export { default } from "./ComponentNameContainer";
```

### Phase 4: Visual Verification

Compare the implementation against the Figma screenshot:

**Option A: Web verification (preferred for speed)**
1. Start dev server if not running
2. Use Playwright MCP `browser_navigate` to the page
3. Use `browser_take_screenshot` to capture the rendered component
4. Compare side-by-side with the Figma `get_screenshot`
5. Iterate on differences

**Option B: Native verification**
1. `bun run start:simulator:ios:dev`
2. Navigate to the component
3. Visual comparison via Maestro or manual screenshot

### Phase 5: Iterate on Differences

Common issues to check and fix:
- **Spacing off** — Re-check Figma spacing values, convert to Tailwind scale
- **Colors wrong** — Verify NativeWind token mapping, check dark mode
- **Text sizing** — Verify font-size mapping from Figma px to NativeWind class
- **Layout direction** — Ensure flex-row vs flex-col matches Figma frame direction
- **Missing elements** — Check if small icons, dividers, or badges were missed
- **Overflow/truncation** — Add `numberOfLines` or `className="truncate"` where needed

## Anti-Patterns

### DO NOT copy `get_design_context` output directly

```typescript
// WRONG: Pasting web code from Figma MCP
<div className="flex flex-row gap-4 p-6">
  <span className="text-gray-500">Item Name</span>
</div>

// CORRECT: Translate to atoms + semantic tokens
<Stack direction="horizontal" space="4" className="p-6">
  <Text variant="body" className="text-content-muted">Item Name</Text>
</Stack>
```

### DO NOT use web-only elements

```typescript
// WRONG
<div>, <span>, <a>, <img>, <ul>, <li>, <table>

// CORRECT
Box, Text, Pressable, Stack, … from @/components/atoms
```

### DO NOT skip the screenshot step

The screenshot is non-negotiable. Without it, Claude has no visual reference and will produce inaccurate layouts. Always run `get_screenshot` before writing any code.

### DO NOT put logic in View files

```typescript
// WRONG: Logic in View
const ItemCardView = ({ itemId }) => {
  const { data } = useQuery(GET_ITEM, { variables: { itemId } });
  return <Text>{data?.name}</Text>;
};

// CORRECT: Logic in Container, View receives primitives
const ItemCardView = ({ name }: { name: string }) => (
  <Text>{name}</Text>
);
```

## File Structure

```
features/{feature}/components/{ComponentName}/
  {ComponentName}Container.tsx    # Logic
  {ComponentName}View.tsx         # Presentation
  index.tsx                       # Barrel export
  __tests__/
    {ComponentName}Container.test.tsx
```

## Integration with Other Skills

- **add-design-library-item** — Run FIRST whenever a needed atom, variant,
  or token doesn't exist yet
- **visual-parity-sweep** / **debug-visual-difference** — Verify and debug
  the rendered result against the design
