# Project Rules

Project-specific rules and guidelines that apply to this codebase.

Rules in `.claude/rules/` are automatically loaded by Claude Code at session start.
Add project-specific patterns, conventions, and requirements below.

---

Always prefer Record<string, T> over Map<string, T> for simple lookups:

```typescript
type UserNameMap = Record<string, string>;
const userNames: UserNameMap = { id1: "John Doe", id2: "Jane Smith" };
const name = userNames[userId];
```

Always spread arrays before sorting to avoid mutation:

```typescript
const sorted = [...Object.values(seasonData)].sort((a, b) =>
  a.season > b.season ? 1 : -1
);
```

Always use optional chaining and nullish coalescing for null-safe reduce:

```typescript
const boardColorMap =
  data?.edges?.reduce(
    (acc, edge) => (edge.color ? { ...acc, [edge.tagId]: edge.color } : acc),
    {} as Record<string, string>
  ) ?? {};
```

Always use bracket notation instead of Map.get():

```typescript
const color = colorMap[tagId] || DEFAULT_COLOR;
const hasPlayer = playerId in playersOnKanban;
```

Always use actual GraphQL schema keys in test data:

```typescript
const mockPlayerData = {
  passingTransPositionalCategoricalScore: [
    { season: 2023, passing_overall: 85 },
  ],
};
```

Always test immutability when refactoring to reduce patterns:

```typescript
test("should create new object on each reduce iteration", () => {
  expect(result1).not.toBe(result2); // Different references
  expect(result1).toEqual(result2); // Same values
});
```

Always verify plain object vs Map in tests when refactoring from Map to Record:

```typescript
test("should return plain object, not Map", () => {
  expect(result).toBeInstanceOf(Object);
  expect(result).not.toBeInstanceOf(Map);
});
```

Always use proper types instead of `any`:

```typescript
// Use unknown with type guards
const processValue = (value: unknown) =>
  typeof value === "string" ? value.toUpperCase() : String(value);

// Use GraphQL generated types
import { PlayerDetailFragment } from "@/generated/graphql";
const player: PlayerDetailFragment = data.player;
```

Always use type guards instead of type assertions for error handling:

```typescript
try {
  await performAction();
} catch (error) {
  const msg = error instanceof Error ? error.message : "Unknown error";
  console.error(msg);
}
```

Always use library-provided types for third-party integrations:

```typescript
import { DragEndEvent, DragStartEvent, Active } from "@dnd-kit/core";
import { CSSProperties } from "react";
type DragSensors = NonNullable<ComponentProps<typeof DndContext>["sensors"]>;
```

Always leverage GraphQL generated types:

```typescript
import {
  PlayerDetailFragment,
  GetPlayerQuery,
  ListPlayersQuery,
} from "@/generated/graphql";
```

Always use readonly for Apollo cache modifier types:

```typescript
modify({
  fields: {
    myField(existingData: readonly { __ref: string }[] = [], { readField }) {
      return existingData.filter(ref => readField("id", ref) !== idToRemove);
    },
  },
});
```

Always verify GraphQL schema before using fields in code.

Never assume test completion without empirical verification:

```bash
yarn lint 2>&1 | grep "@typescript-eslint/no-explicit-any" | wc -l
yarn typecheck
yarn test:unit
```

Always perform comprehensive audit before documentation refactoring:

```markdown
1. Analyze all rules/items in the document
2. Identify duplication with other sources (CLAUDE.md, ESLint, etc.)
3. Categorize content (patterns vs educational vs procedural)
4. Calculate metrics (line count, sections, examples)
5. Document findings before making changes
```

Never use SSEClient or service wrapper classes around third-party libraries.

Always extract duplicate constants to module-level variables:

```typescript
const DEFAULT_VALUE = "constant-value";
const result1 = data || DEFAULT_VALUE;
const result2 = fallback || DEFAULT_VALUE;
```

Never use localStorage in React Native/Expo projects.

Always use FlashList from @shopify/flash-list instead of FlatList for list components:

```typescript
// Correct
import { FlashList } from "@shopify/flash-list";
<FlashList data={items} renderItem={renderItem} />

// Incorrect
import { FlatList } from "react-native";
<FlatList data={items} renderItem={renderItem} />
```

Never migrate DraggableFlatList to FlashList (incompatible libraries):

```typescript
// Keep using DraggableFlatList for drag-and-drop functionality
import DraggableFlatList from "react-native-draggable-flatlist";
```

Always import ListRenderItem from @shopify/flash-list when using FlashList:

```typescript
import { FlashList, ListRenderItem } from "@shopify/flash-list";
```

Always use nullish coalescing (`??`) to preserve existing values when conditionally calculating new ones:

```typescript
// Correct: Preserve existing exp, only calculate from expiresIn if exp is undefined
exp: auth.exp ??
  (auth.expiresIn ? calculateTokenExpiry(auth.expiresIn) : undefined);

// Incorrect: This overwrites exp with undefined when auth.exp exists
exp: !auth.exp && auth.expiresIn
  ? calculateTokenExpiry(auth.expiresIn)
  : undefined;
```

Always extract pure functions with no React dependencies to module level:

```typescript
// Correct: Module-level pure function - created once, easily testable
export function getDeviceInfo(): Record<string, string | null> {
  return { platform: Platform.OS };
}

// Incorrect: Defined inside component - recreated on every render
const MyComponent = () => {
  const getDeviceInfo = () => ({ platform: Platform.OS });
};
```

Always clear queues/collections before processing to prevent race conditions:

```typescript
const processQueue = useCallback(() => {
  const queue = operationQueue.current;
  operationQueue.current = []; // Clear BEFORE processing

  queue.map(item => processItem(item));
}, []);
```

Never use empty catch blocks - always add error logging (console.warn for non-critical, console.error for critical):

```typescript
// Good - logs the error for debugging
} catch (error) {
  console.warn("Failed to persist filter values:", error);
}

// Bad - silently swallows errors, hides issues
} catch (_error) {
  //
}
```

Always use `useQuery` with `skip` when a query depends on another query's
data; use lazy queries only for user-triggered actions like button clicks or
form submissions:

```typescript
// Correct: Declarative - query runs automatically when positions are available
const { data } = usePlayerDetailQuery({ variables: { id: playerId } });

const positionIds = useMemo(
  () => data?.getPlayer?.positions?.map(p => p?.id).filter(Boolean) ?? [],
  [data?.getPlayer?.positions]
);

useRelatedPlayersQuery({
  variables: { positionIds },
  skip: positionIds.length === 0,
});

// Incorrect: Imperative - using lazy query with onCompleted
const [getLazyQuery] = useRelatedPlayersLazyQuery();

usePlayerDetailQuery({
  variables: { id: playerId },
  onCompleted: data => {
    getLazyQuery({ variables: { positionIds: data.positions } });
  },
});
```

Never sync props to state via useEffect - use derived values or controlled components:

```typescript
// Correct: Derive value during render
const selectedOption = useMemo(
  () => options.find(option => option.value === defaultValue),
  [defaultValue, options]
);

// Correct: Use value directly for controlled component
const MySlider = ({ value, onChange }: Props) => {
  // Use value prop directly, no local state
  return <Slider value={value} onValueChange={onChange} />;
};

// Incorrect: Syncing state with prop via useEffect
const [selectedOption, setSelectedOption] = useState();
useEffect(() => {
  setSelectedOption(options.find(o => o.value === defaultValue));
}, [defaultValue, options]);
```

Always use `key` prop to reset component state instead of useEffect with multiple setState calls:

```typescript
// Correct: Key forces remount with fresh state when modal opens
<ModalContent key={isOpen ? "open" : "closed"} {...props} />

// Correct: Key resets pagination when data source changes
<DataTable key={dataSourceId} data={data} />

// Incorrect: Resetting state via useEffect
useEffect(() => {
  if (!isOpen) {
    setActiveTab("browse");
    setSearchQuery("");
    setSelectedIds([]);
  }
}, [isOpen]);
```

Never add eslint-disable for one rule while removing existing eslint-disable comments for other rules:

```typescript
// Correct: Preserve all necessary eslint-disable comments
useEffect(() => {
  if (isOpen) {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- External scroll signal
    setIsOpen(false);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- Only react to trigger, not state
}, [scrollTrigger]);

// Incorrect: Removing exhaustive-deps disable when adding set-state-in-effect disable
useEffect(() => {
  if (isOpen) {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- External scroll signal
    setIsOpen(false);
  }
}, [isOpen, scrollTrigger]); // BUG: isOpen in deps causes immediate close
```

Always use DOM measurements (`getBoundingClientRect`) in useEffect, not during render:

```typescript
// Correct: DOM measurement in useEffect
const [rect, setRect] = useState<DOMRect | null>(null);

useEffect(() => {
  if (isOpen && ref.current) {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- DOM measurement
    setRect(ref.current.getBoundingClientRect());
  }
}, [isOpen]);

// Incorrect: DOM measurement during render
const rect = ref.current?.getBoundingClientRect(); // Can cause layout thrashing
```

Always derive state during render when value is calculated from other state/props:

```typescript
// Correct: Derived value - calculated during render
const [networkStatus, setNetworkStatus] = useState<NetworkStatus>("online");
const showModal = networkStatus === "offline" || networkStatus === "slow";

// Incorrect: Derived state via useEffect causes extra render cycle
const [networkStatus, setNetworkStatus] = useState<NetworkStatus>("online");
const [showModal, setShowModal] = useState(false);

useEffect(() => {
  setShowModal(networkStatus === "offline" || networkStatus === "slow");
}, [networkStatus]);
```

Always use `useLayoutEffect` to synchronize refs with props/state when the ref is used in callbacks that execute outside render:

```typescript
// Correct: useLayoutEffect runs synchronously before callbacks fire
const tokenRef = useRef(token);
useLayoutEffect(() => {
  tokenRef.current = token;
}, [token]);

// Incorrect: Updating ref during render violates react-hooks/refs
const tokenRef = useRef(token);
tokenRef.current = token; // Lint error: Cannot update ref during render
```

Always use `useState` instead of `useRef` when the value affects render output (JSX props, conditional rendering):

```typescript
// Correct: State because value affects refreshing prop
const [isRefetching, setIsRefetching] = useState(false);
return <FlatList refreshing={isRefetching} />;

// Incorrect: Ref changes don't trigger re-renders, UI won't update
const isRefetchingRef = useRef(false);
return <FlatList refreshing={isRefetchingRef.current} />; // Never updates
```

Always validate infrastructure compatibility in research phase before starting migration projects:

```typescript
// Research checklist for migrations:
// 1. Target library version requirements
// 2. Current Jest/test framework version compatibility
// 3. React/React Native version compatibility
// 4. Test environment (jsdom vs node vs react-native) requirements
// 5. Known issues in library's GitHub issues
```

Always audit mock patterns for compatibility before migrating testing libraries:

```bash
# Inventory mocks that return HTML elements vs React Native elements
grep -r "createElement(\"div\|\"button\|\"span" __tests__/ jest/
grep -r "require(\"react\").createElement" __tests__/ jest/
```

Mock returns must match the target library's expected element types (HTML for jsdom, RN elements for React Native Testing Library).

Always use incremental migration strategy for large library migrations:

```typescript
// For migrations with infrastructure changes:
// 1. Create parallel test configuration (don't replace existing)
// 2. Migrate tests incrementally by feature/directory
// 3. Keep both configurations working until fully migrated
// 4. Remove old configuration only after all tests pass

// Example: jest.config.ts with dual configuration
export default {
  projects: [
    { displayName: "existing", preset: "jest-expo" },
    { displayName: "migration", preset: "jest-expo/universal" },
  ],
};
```

Always document upstream issues that may block migrations before starting work:

```bash
# Check GitHub issues for known blockers
# Document in research.md:
# - Jest version compatibility: expo/expo#40184
# - React version issues: expo/expo#38046
# - Monitor issues before retrying migration
```

Always track specific bindings in codemods instead of presence flags:

```typescript
// Correct: Track specific variable binding
const containerBindings = new Set<string>();
if (node.id.type === "Identifier" && node.id.name === "container") {
  containerBindings.add(path.scope.uid);
}

// Incorrect: Only track presence
const hasContainer = true; // All "container" identifiers renamed globally
```

Always use `require()` inside jest.mock factory functions to avoid module hoisting issues:

```typescript
// Correct: require() runs at mock time, not import time
jest.mock("react-native-gesture-handler", () => ({
  GestureHandlerRootView: require("react-native").View,
  PanGestureHandler: require("react-native").View,
}));

// Incorrect: Import hoisting causes undefined values
import { View } from "react-native";
jest.mock("react-native-gesture-handler", () => ({
  GestureHandlerRootView: View, // May be undefined due to hoisting
}));
```

Always ensure validation schemas match TypeScript type definitions exactly:

```typescript
// Type definition
type TPlayerWatchlistParams = {
  player_id: string; // required
  player_name?: string; // optional
};

// Correct: Schema matches type exactly
const schema = object({
  player_id: string().required(),
  player_name: string().optional(),
});

// Incorrect: Schema missing required field
const schema = object({
  player_name: string().optional(), // Missing player_id!
});
```

Never use type assertions (`as Type`) in test data - let TypeScript infer types to catch missing required fields:

```typescript
// Correct: TypeScript catches missing required fields
const testParams: TPlayerWatchlistParams = {
  player_id: "123",
  player_name: "John",
};

// Incorrect: Type assertion bypasses compile-time validation
const testParams = { player_name: "John" } as TPlayerWatchlistParams; // Missing player_id!
```

Always add configuration validation with development warnings for third-party service integrations:

```typescript
// Correct: Validate config and warn in development
function isConfigValid(config: FirebaseConfig): boolean {
  return Boolean(config.apiKey && config.projectId && config.appId);
}

if (!isConfigValid(firebaseConfig) && __DEV__) {
  console.warn(
    "Firebase configuration is incomplete. Analytics will not function. " +
      "Please configure web.firebase in app.config.ts"
  );
}

// Incorrect: Silent failure when config is missing
const firebaseConfig = expoConfig?.web?.firebase ?? {}; // Fails silently
Always type mock functions explicitly when accessing `mock.calls` to avoid TypeScript tuple type errors:

```typescript
// Correct: Explicitly typed mock function
const mockQuery = jest.fn() as jest.MockedFunction<typeof useMyQuery>;
const [firstCallArgs] = mockQuery.mock.calls[0];

// Correct: Alternative - type the calls access
const mockFn = jest.fn();
const args = mockFn.mock.calls[0] as [string, number];

// Incorrect: Untyped mock causes tuple inference errors
const mockFn = jest.fn();
const [arg1, arg2] = mockFn.mock.calls[0]; // TS error: Tuple type 'unknown[]'
```

Always define mock functions at module scope with `mock` prefix for stable references in jest.mock factories:

```typescript
// Correct: Module-scope mock with `mock` prefix - stable reference across calls
const mockMutation = jest.fn();
jest.mock("@/generated/graphql", () => ({
  useSomeMutation: jest.fn(() => [mockMutation, { loading: false }]),
}));

// Incorrect: New function instance created on each hook call - defeats memoization tests
jest.mock("@/generated/graphql", () => ({
  useSomeMutation: jest.fn(() => [jest.fn(), { loading: false }]),
}));
```

Note: Jest hoisting rules require the `mock` prefix for out-of-scope variable access in mock factories.

Always use ref guards with `.finally()` to ensure mutation idempotency in useEffect:

```typescript
const operationInProgress = useRef(false);

useEffect(() => {
  if (shouldRunOperation && !operationInProgress.current) {
    operationInProgress.current = true;
    performMutation()
      .finally(() => {
        operationInProgress.current = false;
      });
  }
}, [shouldRunOperation, otherDeps]);
```

The `.finally()` ensures the guard resets whether the operation succeeds or fails, allowing retry on subsequent render cycles.

Always use never-resolving promises to test mutation idempotency during rapid re-renders:

```typescript
it("should only trigger mutation once during rapid re-renders", async () => {
  // Setup condition that triggers mutation
  mockQuery.mockReturnValue({ data: null, loading: false });

  // Make mutation hang to keep triggering condition true
  mockMutation.mockImplementation(() => new Promise(() => {}));

  const { rerender } = renderHook(() => useHookUnderTest());

  // Simulate rapid re-renders
  rerender({});
  rerender({});
  rerender({});

  // Should only be called once despite multiple renders
  expect(mockMutation).toHaveBeenCalledTimes(1);
});
```

Key insight: If the test fails, the ref guard protecting the mutation is missing or broken.

Always use lookup tables with a single return statement to satisfy `sonarjs/function-return-type` for functions returning mixed primitive types:

```typescript
// Correct: Single return from typed lookup
type ReactiveVarValue = string | number | null | undefined;
const valuesByKey: Record<string, ReactiveVarValue> = {
  status: "disconnected",
  count: 3,
  current: null,
};
mockFn.mockImplementation(key => valuesByKey[key.name] ?? undefined);

// Incorrect: Multiple returns with different types triggers lint error
mockFn.mockImplementation(key => {
  if (key === statusKey) return "disconnected";
  if (key === countKey) return 3;
  return null;
});
```

Always replace boolean selector parameters with typed string literals and lookup objects (`sonarjs/no-selector-parameter`):

```typescript
// Correct: Typed literal with lookup object
export type Theme = "dark" | "light";

const INDICATOR_COLORS: Record<Theme, string> = {
  dark: "#60A5FA",
  light: "#3B82F6",
} as const;

export function getIndicatorColor(theme: Theme): string {
  return INDICATOR_COLORS[theme];
}

// Call site converts boolean to typed literal:
const theme: Theme = isDark ? "dark" : "light";
getIndicatorColor(theme);

// Incorrect: Boolean parameter selects behavior
export function getIndicatorColor(isDark: boolean): string {
  return isDark ? "#60A5FA" : "#3B82F6";
}
```

Never define multiple React components in a single View file - extract to separate Container/View component directories:

```typescript
// Incorrect: Inline component in a View file (even with memo/useCallback)
const ParentView = ({ items, onSelect }: Props) => {
  // This creates a new component definition, violating one-component-per-file
  const ItemRow = React.memo(({ item, onPress }: ItemProps) => (
    <Pressable onPress={onPress}>
      <Text>{item.label}</Text>
    </Pressable>
  ));

  return (
    <VStack>
      {items.map(item => (
        <ItemRow key={item.id} item={item} onPress={() => onSelect(item)} />
      ))}
    </VStack>
  );
};

// Correct: Extract to separate component directory
// features/my-feature/components/ItemRow/ItemRowView.tsx
const ItemRowView = ({ label, onPress }: ItemRowViewProps) => (
  <Pressable onPress={onPress}>
    <Text>{label}</Text>
  </Pressable>
);

// features/my-feature/components/ItemRow/ItemRowContainer.tsx
const ItemRowContainer = ({ item, onSelect }: ItemRowContainerProps) => {
  const handlePress = useCallback(() => {
    onSelect(item);
  }, [item, onSelect]);

  return <ItemRowView label={item.label} onPress={handlePress} />;
};

// features/my-feature/components/ItemRow/index.tsx
export { default } from "./ItemRowContainer";

// Then import and use in ParentView
import ItemRow from "../ItemRow";

const ParentView = ({ items, onSelect }: Props) => (
  <VStack>
    {items.map(item => (
      <ItemRow key={item.id} item={item} onSelect={onSelect} />
    ))}
  </VStack>
);
```

This pattern ensures:
- One component per file (easier to test, find, and maintain)
- Proper Container/View separation (logic in Container, presentation in View)
- Stable callback references via useCallback in Container
- No inline function props (avoids react-perf/jsx-no-new-function-as-prop)
- Reusable components across the codebase

Always import validated environment variables from `@/lib/env` instead of accessing `process.env` directly:

```typescript
// Correct: Type-safe, validated at startup
import { env } from "@/lib/env";
const apiUrl = env.EXPO_PUBLIC_GRAPHQL_BASE_URL;

// Incorrect: Untyped, no validation
const apiUrl = process.env.EXPO_PUBLIC_GRAPHQL_BASE_URL;
```

Always use `jest.unmock("@/lib/env")` in tests that need the real env implementation instead of the global mock:

```typescript
// For tests that need actual env validation behavior
jest.unmock("@/lib/env");
import { env } from "@/lib/env";

// Default behavior: Global mock in jest.setup.ts provides sensible defaults
```

Always use empty string fallback for optional string env vars, but rely on Zod schema defaults for booleans:

```typescript
// Correct: Optional strings need explicit fallback when empty string is valid
const sentryDsn = env.EXPO_PUBLIC_SENTRY_DSN || "";

// Correct: Booleans have Zod defaults, no runtime fallback needed
const isStreaming = env.EXPO_PUBLIC_ENABLE_STREAMING;

// Incorrect: Boolean fallback with || bypasses Zod default
const isStreaming = env.EXPO_PUBLIC_ENABLE_STREAMING || true; // Always true!
```
