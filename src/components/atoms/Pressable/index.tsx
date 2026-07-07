/**
 * @file Pressable atom — the interaction primitive (RFC §3).
 * @description Replaces raw RN Pressable/TouchableOpacity in app code.
 * Forwards testID and accessibility props (part of the atom API contract).
 * @module components/atoms/Pressable
 */
import React from "react";

import { Pressable as UIPressable } from "@/components/ui/pressable";

import type { WithUnsafeStyle } from "../types";

/**
 *
 */
type UIPressableProps = React.ComponentProps<typeof UIPressable>;

/**
 *
 */
export interface PressableProps
  extends
    Omit<UIPressableProps, "style">,
    WithUnsafeStyle<UIPressableProps["style"]> {}

const Pressable = React.forwardRef<
  React.ComponentRef<typeof UIPressable>,
  PressableProps
>(function Pressable({ UNSAFE_style, ...props }, ref) {
  return <UIPressable ref={ref} style={UNSAFE_style} {...props} />;
});

Pressable.displayName = "Pressable";

export { Pressable };
