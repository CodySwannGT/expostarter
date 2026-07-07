/**
 * Index route for the application.
 * Displays a simple "Hello, World!" greeting with build version information.
 * Built exclusively from design-library atoms + semantic tokens.
 *
 * URL: /
 *
 * Test IDs for E2E testing:
 * - `home:container` - Main container box
 * - `home:title` - Hello World text element
 * - `home:version` - Version string pressable element
 * @see https://docs.expo.dev/router/introduction
 * @module app/index
 */
import { useCallback, useMemo } from "react";
import { Alert, Platform } from "react-native";

import * as Clipboard from "expo-clipboard";

import { Box } from "@/components/atoms/Box";
import { Pressable } from "@/components/atoms/Pressable";
import { Text } from "@/components/atoms/Text";
import { formatOtaDebugAlert, getBuildInfo } from "@/lib/build/info";

/**
 * Custom hook for managing version string display and copy functionality.
 * @returns Version string and press handler
 */
function useVersionInfo(): {
  readonly versionString: string;
  readonly handleVersionPress: () => Promise<void>;
} {
  const buildInfo = useMemo(() => getBuildInfo(), []);

  const handleVersionPress = useCallback(async () => {
    if (Platform.OS === "web") {
      await Clipboard.setStringAsync(buildInfo.debugString);
    } else {
      Alert.alert("Build Info", formatOtaDebugAlert(buildInfo));
    }
  }, [buildInfo]);

  return { versionString: buildInfo.displayString, handleVersionPress };
}

/**
 * Index screen component that displays "Hello, World!" with version info.
 * @returns The index screen with centered greeting text and version string.
 */
export default function Index(): React.JSX.Element {
  const { versionString, handleVersionPress } = useVersionInfo();

  return (
    <Box
      testID="home:container"
      className="flex-1 items-center justify-center bg-surface-base"
    >
      <Text
        testID="home:title"
        variant="display-sm"
        className="text-content-primary"
      >
        Hello, World!
      </Text>
      <Pressable testID="home:version" onPress={handleVersionPress}>
        <Text variant="caption" className="mt-4 p-2 text-content-muted">
          {versionString}
        </Text>
      </Pressable>
    </Box>
  );
}
