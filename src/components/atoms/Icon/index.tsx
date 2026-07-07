/**
 * @file Icon atom — Lucide-only iconography (RFC §3).
 * @description Narrowed wrapper over the Gluestack Icon. `as` takes a
 * lucide-react-native icon; size is the closed enum; color via className
 * content tokens (a raw `color` prop is accepted for data-driven values).
 * @module components/atoms/Icon
 */
import React from "react";
import type { ColorValue } from "react-native";

import { Icon as UIIcon } from "@/components/ui/icon";

/** Closed icon size enum (12–24px). */
export type IconSize = "2xs" | "xs" | "sm" | "md" | "lg" | "xl";

/**
 * Public Icon atom props. Declared explicitly (not derived via Omit) because
 * the wrapped Gluestack Icon's props are a union type that Omit would
 * collapse, dropping member-specific keys like `color`.
 */
export interface IconProps {
  /** The lucide-react-native icon component (the only sanctioned icon set). */
  as: React.ElementType;
  /** Closed icon size enum (12–24px). */
  size?: IconSize;
  /** Closed className vocabulary (content tokens for color). */
  className?: string;
  /** Data-driven color value (e.g. chart/tag colors) — not for design tokens. */
  color?: ColorValue;
  /** Stroke/fill passthroughs for SVG-level data-driven styling. */
  fill?: ColorValue;
  stroke?: ColorValue;
  /** Test/a11y identity is part of the atom API (RFC standing constraint 4). */
  testID?: string;
}

const Icon = React.forwardRef<React.ComponentRef<typeof UIIcon>, IconProps>(
  function Icon({ size = "md", ...props }, ref) {
    return <UIIcon ref={ref} size={size} {...props} />;
  }
);

Icon.displayName = "Icon";

export { Icon };
