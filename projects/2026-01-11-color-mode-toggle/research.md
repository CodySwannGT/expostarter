---
date: 2026-01-11T12:00:00-05:00
status: complete
last_updated: 2026-01-11
---

# Research

## Summary

This research documents the existing codebase structures, patterns, and dependencies relevant to implementing a color mode toggle feature. The codebase is an Expo/React Native application using Gluestack UI for components, NativeWind for styling, and Apollo Client for state management. The current app has a simple "Hello, World!" index screen that will need to be refactored to follow the Container/View pattern and integrated with a new color mode feature.

## Detailed Findings

### Current Index Screen (`app/index.tsx`)

The index screen is a simple functional component displaying "Hello, World!" text.

**Location**: `/home/user/thumbwar-frontend/app/index.tsx`

**Current Implementation**:
- Uses `Box` and `Text` from Gluestack UI
- Has hardcoded colors: `bg-white` and `text-gray-900` (not semantic tokens)
- Existing testIDs: `home:container` and `home:title`
- Does NOT follow the Container/View pattern
- Contains no state management or hooks

```typescript
export default function Index(): React.JSX.Element {
  return (
    <Box
      testID="home:container"
      className="flex-1 items-center justify-center bg-white"
    >
      <Text testID="home:title" className="text-2xl font-bold text-gray-900">
        Hello, World!
      </Text>
    </Box>
  );
}
```

### Root Layout (`app/_layout.tsx`)

The root layout wraps the entire application with providers.

**Location**: `/home/user/thumbwar-frontend/app/_layout.tsx`

**Current Implementation**:
- Imports and uses `GluestackUIProvider` without passing a `mode` prop
- GluestackUIProvider defaults to `mode="light"`
- Uses `SafeAreaProvider` from `react-native-safe-area-context`
- Uses `Stack` from `expo-router` with `headerShown: false`
- Imports `@/global.css` for global styles

```typescript
export default function RootLayout(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <GluestackUIProvider>
        <Stack screenOptions={screenOptions} />
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}
```

### GluestackUIProvider Component

The GluestackUIProvider already supports a `mode` prop with the exact types needed.

**Location**: `/home/user/thumbwar-frontend/components/ui/gluestack-ui-provider/index.tsx`

**Key Details**:
- Exports `ModeType = 'light' | 'dark' | 'system'`
- Accepts `mode` prop with default value `'light'`
- Uses NativeWind's `useColorScheme` hook internally
- Calls `setColorScheme(mode)` when mode prop changes
- Renders a `View` wrapper with CSS variables from `config[colorScheme]`
- Wraps children in `OverlayProvider` and `ToastProvider`

```typescript
export type ModeType = 'light' | 'dark' | 'system';

export function GluestackUIProvider({
  mode = 'light',
  ...props
}: {
  mode?: ModeType;
  children?: React.ReactNode;
  style?: ViewProps['style'];
}) {
  const { colorScheme, setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme(mode);
  }, [mode]);
  // ...
}
```

### GluestackUIProvider Config

The color configuration provides semantic tokens for light and dark modes.

**Location**: `/home/user/thumbwar-frontend/components/ui/gluestack-ui-provider/config.ts`

**Key Details**:
- Defines CSS custom properties for both `light` and `dark` themes
- Uses NativeWind's `vars()` function
- Provides semantic color tokens:
  - `--color-background-0` through `--color-background-950`
  - `--color-typography-0` through `--color-typography-950`
  - Primary, secondary, tertiary, error, success, warning, info colors
- Light mode: `--color-background-0: '255 255 255'` (white)
- Dark mode: `--color-background-0: '18 18 18'` (dark gray)

### Button Component

The Button component provides the UI elements needed for the color mode toggle.

**Location**: `/home/user/thumbwar-frontend/components/ui/button/index.tsx`

**Exported Components**:
- `Button` - Main button component
- `ButtonText` - Text child for buttons
- `ButtonSpinner` - Loading spinner
- `ButtonIcon` - Icon child for buttons
- `ButtonGroup` - Container for grouping buttons

**Button Props**:
- `variant`: `'solid'` | `'outline'` | `'link'` (default: `'solid'`)
- `size`: `'xs'` | `'sm'` | `'md'` | `'lg'` | `'xl'` (default: `'md'`)
- `action`: `'primary'` | `'secondary'` | `'positive'` | `'negative'` | `'default'` (default: `'primary'`)

**ButtonGroup Props**:
- `space`: `'xs'` | `'sm'` | `'md'` | `'lg'` | `'xl'` | `'2xl'` | `'3xl'` | `'4xl'`
- `flexDirection`: `'row'` | `'column'` | `'row-reverse'` | `'column-reverse'` (default: `'column'`)
- `isAttached`: boolean

### Features Directory Structure

**Current State**: The `features/` directory does NOT exist.

The directory structure skill documents the expected structure:

```
features/[feature-name]/
├── components/
├── screens/
├── hooks/
│   └── __tests__/
├── stores/
├── utils/
│   └── __tests__/
├── types.ts
├── constants.ts
├── config/
└── operations.graphql
```

### Container/View Pattern Requirements

**Skill Location**: `/home/user/thumbwar-frontend/.claude/skills/container-view-pattern/SKILL.md`

**Key Requirements**:

**Container**:
- Handles ALL business logic
- Uses hooks (useState, useEffect, useCallback, useMemo)
- ONLY renders the corresponding View component
- Event handlers use `handle*` prefix (e.g., `handleSubmit`)

**View**:
- Pure presentation component
- Arrow function shorthand: `() => (...)` not `() => { return (...); }`
- MUST be wrapped in `memo()`
- MUST set `displayName`
- All props marked as `readonly`
- Props use `on*` prefix (e.g., `onSubmit`)
- NO hooks or business logic

**Index**:
- Exports Container as default: `export { default } from './ComponentNameContainer';`

### Local State Management (Apollo Reactive Variables + AsyncStorage)

**Skill Location**: `/home/user/thumbwar-frontend/.claude/skills/local-state/SKILL.md`

**Patterns Documented**:

1. **Creating Reactive Variables**:
```typescript
import { makeVar } from "@apollo/client";
const colorModeVar = makeVar<ColorMode>("system");
```

2. **Reading in Components (Reactive)**:
```typescript
import { useReactiveVar } from "@apollo/client";
const colorMode = useReactiveVar(colorModeVar);
```

3. **Persisting to AsyncStorage**:
```typescript
const STORAGE_KEY = "@thumbwar:color-mode";
await AsyncStorage.setItem(STORAGE_KEY, mode);
```

4. **Loading on App Start**:
```typescript
useEffect(() => {
  loadColorMode();
}, []);
```

**Key Rules**:
- Always create new object references (no mutation)
- Use namespace prefixes for storage keys: `@thumbwar:`
- Always handle AsyncStorage errors with try/catch
- Encapsulate updates in custom hooks

### Existing Test Structure

**Unit Tests**:
- `/home/user/thumbwar-frontend/app/__tests__/index.test.tsx` - Index screen unit tests
- `/home/user/thumbwar-frontend/app/__tests__/_layout.test.tsx` - Layout unit tests

**Integration Tests**:
- `/home/user/thumbwar-frontend/app/__tests__/index.integration.test.tsx` - Index with provider stack
- `/home/user/thumbwar-frontend/app/__tests__/_layout.integration.test.tsx` - Layout integration

**E2E Tests**:
- `/home/user/thumbwar-frontend/e2e/home.spec.ts` - Playwright tests
- `/home/user/thumbwar-frontend/.maestro/flows/home.yaml` - Maestro mobile tests

**Current Index Test Pattern**:
```typescript
describe("Index", () => {
  describe("rendering", () => {
    it("renders without crashing", () => {
      expect(() => render(<Index />)).not.toThrow();
    });

    it("displays Hello, World! text", () => {
      render(<Index />);
      expect(screen.getByText("Hello, World!")).toBeTruthy();
    });
  });
});
```

### Jest Configuration

**Location**: `/home/user/thumbwar-frontend/jest.config.js`

**Key Details**:
- Multi-project configuration (eslint-plugins + expo)
- Uses `jest-expo` preset
- 98% coverage threshold on all metrics
- Module alias: `@/` maps to `<rootDir>/`
- Setup files: `jest.setup.pre.js` and `jest.setup.js`

### Jest Setup Mocks

**Location**: `/home/user/thumbwar-frontend/jest.setup.js`

**Relevant Mocks**:
- `expo-router` - Mocks useRouter, Link, Stack, etc.
- `nativewind` - Mocks `useColorScheme` returning `{ colorScheme: "light", toggleColorScheme: jest.fn() }`
- `react-native-safe-area-context` - Mocks SafeAreaProvider
- `expo-font` - Mocks font loading

### UI Components Available

**Location**: `/home/user/thumbwar-frontend/components/ui/`

Available components that may be useful:
- `box/` - Container component
- `text/` - Text component
- `button/` - Button, ButtonText, ButtonGroup
- `hstack/` - Horizontal stack
- `vstack/` - Vertical stack
- `center/` - Centering container

## Code References

- `app/index.tsx:21-31` - Current Index component implementation
- `app/_layout.tsx:24-31` - Current RootLayout implementation
- `components/ui/gluestack-ui-provider/index.tsx:8` - ModeType export
- `components/ui/gluestack-ui-provider/index.tsx:10-38` - GluestackUIProvider implementation
- `components/ui/gluestack-ui-provider/config.ts:4-309` - Theme configuration with light/dark vars
- `components/ui/button/index.tsx:287-304` - Button component with variant props
- `components/ui/button/index.tsx:399-426` - ButtonGroup component
- `jest.setup.js:77-83` - NativeWind useColorScheme mock

## Architecture Documentation

### Technology Stack
- **Framework**: Expo SDK 54 with Expo Router 6
- **UI Library**: Gluestack UI v3 with NativeWind v4
- **State Management**: Apollo Client 3.10 (Reactive Variables)
- **Persistence**: React Native AsyncStorage
- **Testing**: Jest 30, @testing-library/react-native, Playwright, Maestro
- **Package Manager**: Bun

### Project Patterns
- **Component Pattern**: Container/View separation (enforced by ESLint)
- **Feature Organization**: Feature modules in `features/` directory
- **Route Files**: Thin wrappers in `app/` directory
- **State Pattern**: Apollo Reactive Variables + AsyncStorage for persistence
- **Test Organization**: `__tests__/` subdirectories

### Semantic Color Tokens
The brief specifies using semantic tokens instead of hardcoded colors:
- `bg-background-0` instead of `bg-white`
- `text-typography-900` instead of `text-gray-900`

## E2E Test Impact

### Existing Tests

- `/home/user/thumbwar-frontend/e2e/home.spec.ts` - Verifies "Hello, World!" text and home container visibility using testIDs `home:title` and `home:container`
- `/home/user/thumbwar-frontend/.maestro/flows/home.yaml` - Mobile E2E test verifying home screen loads with `home:container` and `home:title` testIDs

### Tests Requiring Modification

- `/home/user/thumbwar-frontend/e2e/home.spec.ts` - Will need additional tests for color mode buttons (new testIDs: `home:color-mode-buttons`, `home:color-mode-light`, `home:color-mode-dark`, `home:color-mode-system`)
- `/home/user/thumbwar-frontend/.maestro/flows/home.yaml` - Will need additional assertions for color mode buttons

### Tests to Remove

None - Existing tests remain valid.

### New Tests Needed

**Unit Tests**:
- `features/color-mode/stores/__tests__/colorModeStore.test.ts` - Store reactive variable and persistence tests
- `features/color-mode/hooks/__tests__/useColorMode.test.ts` - Custom hook tests
- `app/__tests__/IndexView.test.tsx` - View component rendering tests (new file after Container/View split)
- Update `app/__tests__/index.test.tsx` - Container tests after refactoring

**Integration Tests**:
- Update `app/__tests__/index.integration.test.tsx` - Full flow with color mode buttons

**E2E Tests**:
- Add color mode button tests to `e2e/home.spec.ts`
- Add color mode persistence test (reload and verify)
- Update `.maestro/flows/home.yaml` for mobile E2E

## Open Questions

1. **IndexView Location**: The brief shows `app/IndexView.tsx` but the Container/View pattern skill suggests component directories. Since this is the root route, placing IndexView directly in `app/` may be acceptable. <---- follow the pattern of creating a feature called "sample" and seting up the screens and components in there.

2. **Apollo Client Provider**: The current _layout.tsx does not show an Apollo Client provider. Will need to verify if it's set up elsewhere or if it needs to be added for reactive variables to work. <------- you shouldn't need apollo client for this. it can be a separate provider/context

3. **Web vs Native Persistence**: AsyncStorage works across platforms, but behavior may differ slightly on web. May need to verify web persistence works correctly. <------- use AsyncStorage for all
