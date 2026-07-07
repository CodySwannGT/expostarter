/**
 * @file Button atom — data-driven action primitive (RFC §3).
 * @description Narrows the Gluestack compound Button: callers pass data
 * (label, icon, tone, size), never ButtonText/ButtonIcon trees — the
 * compound ceremony is assembled inside the atom.
 * @module components/atoms/Button
 */
import React from "react";

import {
  Button as UIButton,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";

import type { WithUnsafeStyle } from "../types";

/**
 *
 */
type UIButtonProps = React.ComponentProps<typeof UIButton>;
/**
 *
 */
type IconComponent = React.ElementType;

/** Semantic intent — maps to the Gluestack action internally. */
export type ButtonTone = "primary" | "secondary" | "positive" | "danger";
/**
 *
 */
export type ButtonVariant = "solid" | "outline" | "link";
/**
 *
 */
export type ButtonSize = "xs" | "sm" | "md" | "lg";

const TONE_TO_ACTION: Record<
  ButtonTone,
  "primary" | "secondary" | "positive" | "negative"
> = {
  primary: "primary",
  secondary: "secondary",
  positive: "positive",
  danger: "negative",
};

/**
 * Accessible-name contract: a button must carry a visible `label`, an
 * `accessibilityLabel`, or both — icon-only buttons without either are
 * uncompilable (RFC core principle).
 */
type ButtonA11yLabel =
  | { /** Visible label. */ label: string; accessibilityLabel?: string }
  | {
      /** Icon-only buttons: no visible label, so the a11y label is required. */
      label?: never;
      accessibilityLabel: string;
    };

/**
 *
 */
interface ButtonOwnProps
  extends
    Omit<
      UIButtonProps,
      | "action"
      | "variant"
      | "size"
      | "style"
      | "children"
      | "accessibilityLabel"
    >,
    WithUnsafeStyle<UIButtonProps["style"]> {
  /** Semantic intent (danger maps to Gluestack "negative"). */
  tone?: ButtonTone;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Optional Lucide icon rendered beside the label. */
  icon?: IconComponent;
  iconPosition?: "leading" | "trailing";
  /** Renders a spinner in place of the icon and disables the button. */
  isLoading?: boolean;
}

/**
 * Public Button atom props — own props plus the accessible-name contract
 * (`label` and/or `accessibilityLabel` is required at the type level).
 */
export type ButtonProps = ButtonOwnProps & ButtonA11yLabel;

const Button = React.forwardRef<
  React.ComponentRef<typeof UIButton>,
  ButtonProps
>(function Button(
  {
    label,
    tone = "primary",
    variant = "solid",
    size = "md",
    icon,
    iconPosition = "leading",
    isLoading = false,
    isDisabled,
    UNSAFE_style,
    ...props
  },
  ref
) {
  const showLeading = icon && iconPosition === "leading" && !isLoading;
  const showTrailing = icon && iconPosition === "trailing" && !isLoading;
  return (
    <UIButton
      ref={ref}
      action={TONE_TO_ACTION[tone]}
      variant={variant}
      size={size}
      isDisabled={isDisabled || isLoading}
      style={UNSAFE_style}
      {...props}
    >
      {isLoading ? <ButtonSpinner /> : null}
      {showLeading ? <ButtonIcon as={icon} /> : null}
      {label ? <ButtonText>{label}</ButtonText> : null}
      {showTrailing ? <ButtonIcon as={icon} /> : null}
    </UIButton>
  );
});

Button.displayName = "Button";

export { Button };
