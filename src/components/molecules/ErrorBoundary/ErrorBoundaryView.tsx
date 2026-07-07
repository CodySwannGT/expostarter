/**
 * Default fallback UI shown when the ErrorBoundary catches an error.
 * Presentational only — the catching/reporting logic lives in
 * ErrorBoundaryContainer.
 * @module components/molecules/ErrorBoundary/ErrorBoundaryView
 */
import { memo } from "react";

import { Center } from "@/components/atoms/Center";
import { Text } from "@/components/atoms/Text";

/**
 * Renders the default "something went wrong" message, centered.
 * Built from atoms + semantic tokens so it matches the design system.
 */
const ErrorBoundaryView = (): React.JSX.Element => (
  <Center className="flex-1 bg-surface-base p-5">
    <Text variant="body" className="text-center text-content-primary">
      Something went wrong. Please restart the app.
    </Text>
  </Center>
);

ErrorBoundaryView.displayName = "ErrorBoundaryView";

export default memo(ErrorBoundaryView);
