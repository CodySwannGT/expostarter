/**
 * @file Box atom — generic surface/container primitive (RFC §3).
 * @description Replaces raw `View` in app code. className carries the closed
 * layout/surface vocabulary; UNSAFE_style is the counted escape hatch.
 * @module components/atoms/Box
 */
import React from "react";

import { Box as UIBox } from "@/components/ui/box";

import type { WithUnsafeStyle } from "../types";

/**
 *
 */
type UIBoxProps = React.ComponentProps<typeof UIBox>;

/**
 *
 */
export interface BoxProps
  extends Omit<UIBoxProps, "style">, WithUnsafeStyle<UIBoxProps["style"]> {
  /** Test/a11y identity is part of the atom API (RFC standing constraint 4). */
  testID?: string;
}

const Box = React.forwardRef<React.ComponentRef<typeof UIBox>, BoxProps>(
  function Box({ UNSAFE_style, ...props }, ref) {
    const { testID } = props;
    return (
      <UIBox
        ref={ref}
        style={UNSAFE_style}
        // web Box renders a raw div where bare testID is not data-testid;
        // emit both so the e2e contract (standing constraint 4) holds.
        {...(testID ? ({ "data-testid": testID } as object) : {})}
        {...props}
      />
    );
  }
);

Box.displayName = "Box";

export { Box };
