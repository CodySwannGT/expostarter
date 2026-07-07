/**
 * @file Spinner atom — loading indicator.
 * @description Replaces RN ActivityIndicator and wraps the Gluestack Spinner.
 * @module components/atoms/Spinner
 */
import React from "react";

import { Spinner as UISpinner } from "@/components/ui/spinner";

/** Props of the wrapped Gluestack Spinner. */
type UISpinnerProps = React.ComponentProps<typeof UISpinner>;

/** Public Spinner atom props. */
export interface SpinnerProps extends UISpinnerProps {}

/**
 * Loading indicator atom — thin pass-through over the Gluestack Spinner.
 *
 * @param props - Gluestack Spinner props (size, color, testID, …)
 * @returns The spinner element
 */
function Spinner(props: SpinnerProps) {
  return <UISpinner {...props} />;
}

Spinner.displayName = "Spinner";

export { Spinner };
