# Color Mode Toggle Feature Specification

## Overview

Add light/dark/system mode selection to the app via three buttons displayed underneath the "Hello, World!" text. The user's preference persists across app restarts using AsyncStorage.

## Requirements

### Functional Requirements

1. **Three Mode Buttons**: Display three horizontally-aligned buttons below the "Hello, World!" text:
   - "Light" - Forces light theme
   - "Dark" - Forces dark theme
   - "System" - Follows device preference

2. **Default Mode**: System mode is the default when no preference has been saved

3. **Persistence**: The selected mode persists in AsyncStorage and loads on app start

4. **Visual Feedback**: The currently active mode button should be visually distinct (e.g., solid variant vs outline)

5. **Immediate Effect**: Changing the mode immediately updates the app's color scheme

### Technical Requirements

1. Follow the Container/View pattern for the Index screen
2. Use Apollo Reactive Variables + AsyncStorage per the `local-state` skill
3. Use Gluestack UI Button components with proper sub-component pattern
4. Follow TDD - write failing tests before implementation
5. Add testIDs for E2E testing

## Architecture

### File Structure

```
features/
  color-mode/
    stores/
      colorModeStore.ts      # Reactive variable + persistence logic
      colorModeStore.test.ts # Store unit tests
      index.ts               # Re-exports
    hooks/
      useColorMode.ts        # Custom hook for components
      useColorMode.test.ts   # Hook unit tests
      index.ts               # Re-exports
    index.ts                 # Feature barrel export

app/
  index.tsx                  # Update to use Container/View pattern
  __tests__/
    index.test.tsx           # Update unit tests
    index.integration.test.tsx # Update integration tests

  _layout.tsx                # Update to read color mode from store
```

### Data Flow

```
┌──────────────────────────────────────────────────────────────┐
│                        App Start                              │
└─────────────────────────────┬────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│  _layout.tsx: loadColorMode() from AsyncStorage              │
│  Sets colorModeVar reactive variable                         │
└─────────────────────────────┬────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│  GluestackUIProvider receives mode prop from colorModeVar    │
└─────────────────────────────┬────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│  Index screen: useColorMode() hook                           │
│  - Reads current mode                                        │
│  - Provides setColorMode function                            │
└─────────────────────────────┬────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│  User taps button → setColorMode() →                         │
│  1. Updates colorModeVar (immediate UI update)               │
│  2. Persists to AsyncStorage (background)                    │
└──────────────────────────────────────────────────────────────┘
```

## Implementation Details

### 1. Color Mode Store (`features/color-mode/stores/colorModeStore.ts`)

```typescript
import { makeVar } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";

/** Available color mode options */
type ColorMode = "light" | "dark" | "system";

/** AsyncStorage key with app namespace */
const STORAGE_KEY = "@thumbwar:color-mode";

/** Default color mode */
const DEFAULT_COLOR_MODE: ColorMode = "system";

/** Reactive variable for color mode */
const colorModeVar = makeVar<ColorMode>(DEFAULT_COLOR_MODE);

/** Load persisted color mode on app start */
const loadColorMode = async (): Promise<void> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored && isValidColorMode(stored)) {
      colorModeVar(stored);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to load color mode:", message);
  }
};

/** Save color mode to storage and update reactive variable */
const saveColorMode = async (mode: ColorMode): Promise<void> => {
  colorModeVar(mode);
  try {
    await AsyncStorage.setItem(STORAGE_KEY, mode);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to save color mode:", message);
  }
};

/** Type guard for valid color modes */
const isValidColorMode = (value: string): value is ColorMode => {
  return ["light", "dark", "system"].includes(value);
};
```

### 2. Custom Hook (`features/color-mode/hooks/useColorMode.ts`)

```typescript
import { useReactiveVar } from "@apollo/client";
import { useCallback } from "react";
import { colorModeVar, saveColorMode, type ColorMode } from "../stores";

interface IUseColorModeResult {
  readonly colorMode: ColorMode;
  readonly setColorMode: (mode: ColorMode) => void;
}

const useColorMode = (): IUseColorModeResult => {
  const colorMode = useReactiveVar(colorModeVar);

  const setColorMode = useCallback((mode: ColorMode) => {
    saveColorMode(mode);
  }, []);

  return { colorMode, setColorMode };
};
```

### 3. Root Layout Update (`app/_layout.tsx`)

```typescript
import { loadColorMode, colorModeVar } from "@/features/color-mode";
import { useReactiveVar } from "@apollo/client";
import { useEffect } from "react";

export default function RootLayout(): React.JSX.Element {
  const colorMode = useReactiveVar(colorModeVar);

  useEffect(() => {
    loadColorMode();
  }, []);

  return (
    <SafeAreaProvider>
      <GluestackUIProvider mode={colorMode}>
        <Stack screenOptions={screenOptions} />
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}
```

### 4. Index Screen with Container/View Pattern

**Container (`app/index.tsx`)**:
```typescript
import { useColorMode } from "@/features/color-mode";
import IndexView from "./IndexView";

export default function Index(): React.JSX.Element {
  const { colorMode, setColorMode } = useColorMode();

  return (
    <IndexView
      colorMode={colorMode}
      onColorModeChange={setColorMode}
    />
  );
}
```

**View (`app/IndexView.tsx`)**:
```typescript
import { memo } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button, ButtonText, ButtonGroup } from "@/components/ui/button";

interface IIndexViewProps {
  readonly colorMode: "light" | "dark" | "system";
  readonly onColorModeChange: (mode: "light" | "dark" | "system") => void;
}

const IndexView = memo(function IndexView({
  colorMode,
  onColorModeChange
}: IIndexViewProps): React.JSX.Element {
  return (
    <Box
      testID="home:container"
      className="flex-1 items-center justify-center bg-background-0"
    >
      <Text
        testID="home:title"
        className="text-2xl font-bold text-typography-900"
      >
        Hello, World!
      </Text>

      <ButtonGroup
        testID="home:color-mode-buttons"
        flexDirection="row"
        space="sm"
        className="mt-4"
      >
        <Button
          testID="home:color-mode-light"
          variant={colorMode === "light" ? "solid" : "outline"}
          action="primary"
          size="sm"
          onPress={() => onColorModeChange("light")}
        >
          <ButtonText>Light</ButtonText>
        </Button>

        <Button
          testID="home:color-mode-dark"
          variant={colorMode === "dark" ? "solid" : "outline"}
          action="primary"
          size="sm"
          onPress={() => onColorModeChange("dark")}
        >
          <ButtonText>Dark</ButtonText>
        </Button>

        <Button
          testID="home:color-mode-system"
          variant={colorMode === "system" ? "solid" : "outline"}
          action="primary"
          size="sm"
          onPress={() => onColorModeChange("system")}
        >
          <ButtonText>System</ButtonText>
        </Button>
      </ButtonGroup>
    </Box>
  );
});
```

## Test IDs

| Element | Test ID |
|---------|---------|
| Main container | `home:container` |
| Hello World text | `home:title` |
| Button group | `home:color-mode-buttons` |
| Light button | `home:color-mode-light` |
| Dark button | `home:color-mode-dark` |
| System button | `home:color-mode-system` |

## Test Cases

### Unit Tests

#### colorModeStore.test.ts
- [ ] `colorModeVar` initializes with "system" as default
- [ ] `loadColorMode` loads valid mode from AsyncStorage
- [ ] `loadColorMode` ignores invalid stored values
- [ ] `loadColorMode` handles AsyncStorage errors gracefully
- [ ] `saveColorMode` updates reactive variable immediately
- [ ] `saveColorMode` persists to AsyncStorage
- [ ] `saveColorMode` handles AsyncStorage errors gracefully
- [ ] `isValidColorMode` returns true for valid modes
- [ ] `isValidColorMode` returns false for invalid modes

#### useColorMode.test.ts
- [ ] Returns current color mode from reactive variable
- [ ] `setColorMode` calls `saveColorMode` with correct mode
- [ ] Hook re-renders when color mode changes

#### IndexView.test.tsx
- [ ] Renders "Hello, World!" text
- [ ] Renders three color mode buttons
- [ ] Light button shows solid variant when mode is "light"
- [ ] Dark button shows solid variant when mode is "dark"
- [ ] System button shows solid variant when mode is "system"
- [ ] Calls `onColorModeChange` with "light" when Light pressed
- [ ] Calls `onColorModeChange` with "dark" when Dark pressed
- [ ] Calls `onColorModeChange` with "system" when System pressed

#### Index.test.tsx (Container)
- [ ] Renders IndexView with color mode props
- [ ] Passes correct colorMode to IndexView
- [ ] Passes working onColorModeChange handler

### Integration Tests

#### index.integration.test.tsx
- [ ] Full flow: tap button → mode changes → persists to storage
- [ ] App loads with persisted color mode
- [ ] GluestackUIProvider receives correct mode prop

### E2E Tests (Playwright/Maestro)

- [ ] Verify default shows system mode selected
- [ ] Tap Light → theme changes to light
- [ ] Tap Dark → theme changes to dark
- [ ] Tap System → theme follows device
- [ ] Reload app → preference persists

## Acceptance Criteria

1. Three buttons (Light, Dark, System) appear below "Hello, World!"
2. System is selected by default on fresh install
3. Tapping a button immediately changes the app's color scheme
4. The active button is visually distinct (solid vs outline)
5. Closing and reopening the app preserves the selection
6. All unit tests pass with 98%+ coverage
7. Integration tests verify end-to-end flow
8. E2E tests pass on web platform
9. Code follows Container/View pattern
10. No ESLint warnings or errors
11. TypeScript compiles without errors

## Dependencies

- `@apollo/client` (already installed) - Reactive variables
- `@react-native-async-storage/async-storage` (already installed) - Persistence
- `@/components/ui/button` (already exists) - Button components

## Notes

- The `GluestackUIProvider` already accepts a `mode` prop of type `"light" | "dark" | "system"`
- Use semantic color tokens (`bg-background-0`, `text-typography-900`) for automatic dark mode support
- The current hardcoded `bg-white` and `text-gray-900` in index.tsx should be replaced with semantic tokens
