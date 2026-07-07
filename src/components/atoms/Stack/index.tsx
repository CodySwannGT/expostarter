/**
 * @file Stack atom — the layout primitive (RFC §3).
 * @description Vertical/horizontal flex container with an enum `space` gap.
 * Spacing belongs to layout parents (the no-margin rule): children never set
 * their own margins; Stacks space them.
 * @module components/atoms/Stack
 */
import React from "react";

import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";

import { GAP_CLASS, type SpaceToken, type WithUnsafeStyle } from "../types";

/**
 *
 */
type UIStackProps = React.ComponentProps<typeof VStack>;

/**
 *
 */
export interface StackProps
  extends
    Omit<UIStackProps, "space" | "style">,
    WithUnsafeStyle<UIStackProps["style"]> {
  /** Layout axis. Defaults to vertical. */
  direction?: "vertical" | "horizontal";
  /** Gap between children — ratified spacing tokens only. */
  space?: SpaceToken;
  /** Test/a11y identity is part of the atom API (RFC standing constraint 4). */
  testID?: string;
}

const Stack = React.forwardRef<React.ComponentRef<typeof VStack>, StackProps>(
  function Stack(
    { direction = "vertical", space, className, UNSAFE_style, ...props },
    ref
  ) {
    const Component = direction === "horizontal" ? HStack : VStack;
    const gap = space ? GAP_CLASS[space] : undefined;
    const { testID } = props;
    return (
      <Component
        ref={ref}
        className={gap ? `${gap} ${className ?? ""}`.trim() : className}
        style={UNSAFE_style}
        // web stacks render raw divs; emit data-testid for the e2e contract
        {...(testID ? ({ "data-testid": testID } as object) : {})}
        {...props}
      />
    );
  }
);

Stack.displayName = "Stack";

export { Stack };
