/**
 * @file Heading atom — title/display ladder of the ratified type scale.
 * @description Narrowed wrapper over the Gluestack Heading; `variant` is the
 * bundled title/display style (defaults to `title`).
 * @module components/atoms/Heading
 */
import React from "react";

import { Heading as UIHeading } from "@/components/ui/heading";

import {
  TEXT_VARIANT_CLASS,
  type TextVariant,
  type WithUnsafeStyle,
} from "../types";

/**
 *
 */
type UIHeadingProps = React.ComponentProps<typeof UIHeading>;

/** Title/display subset of the ratified text styles. */
export type HeadingVariant = Extract<
  TextVariant,
  | "title-sm"
  | "title"
  | "title-lg"
  | "display-sm"
  | "display-md"
  | "display-lg"
  | "display-xl"
  | "display-2xl"
>;

/**
 *
 */
export interface HeadingProps
  extends
    Omit<UIHeadingProps, "size" | "style">,
    WithUnsafeStyle<UIHeadingProps["style"]> {
  /** Ratified title/display style bundle. */
  variant?: HeadingVariant;
  /** Test/a11y identity is part of the atom API (RFC standing constraint 4). */
  testID?: string;
}

const Heading = React.forwardRef<
  React.ComponentRef<typeof UIHeading>,
  HeadingProps
>(function Heading(
  { variant = "title", className, UNSAFE_style, ...props },
  ref
) {
  const { testID } = props;
  return (
    <UIHeading
      ref={ref}
      className={`${TEXT_VARIANT_CLASS[variant]} ${className ?? ""}`.trim()}
      style={UNSAFE_style}
      // web headings render raw h-tags; emit data-testid for the e2e contract
      {...(testID ? ({ "data-testid": testID } as object) : {})}
      {...props}
    />
  );
});

Heading.displayName = "Heading";

export { Heading };
