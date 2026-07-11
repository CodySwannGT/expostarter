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

/** Semantic intent — maps to the Gluestack v5 button variant internally. */
export type ButtonTone = "primary" | "secondary" | "positive" | "danger";
/**
 *
 */
export type ButtonVariant = "solid" | "outline" | "link";
/**
 *
 */
export type ButtonSize = "xs" | "sm" | "md" | "lg";

/** Gluestack v5's button variants (default/destructive/outline/secondary/ghost/link). */
type UIButtonVariant = NonNullable<UIButtonProps["variant"]>;
/** Gluestack v5's button sizes (default/sm/lg/icon). */
type UIButtonSize = NonNullable<UIButtonProps["size"]>;

/**
 * Gluestack v5 collapsed the v3 `action` (intent) + `variant` (style) axes into
 * a single `variant`. Map the atom's stable (tone, variant) public API onto it:
 * a solid button carries its intent (default/secondary/destructive), while
 * outline/link stay neutral in v5's vocabulary.
 * TODO(design-system): v5 has no success/"positive" or tone-colored
 * outline/link variant — restore those by extending the vendored button tva
 * with our status tokens if brand parity requires it.
 * @param tone Semantic intent.
 * @param variant Visual style.
 * @returns The Gluestack v5 button variant.
 */
function toUIVariant(
  tone: ButtonTone,
  variant: ButtonVariant
): UIButtonVariant {
  if (variant === "link") return "link";
  if (variant === "outline") return "outline";
  if (tone === "danger") return "destructive";
  if (tone === "secondary") return "secondary";
  return "default";
}

/** v5 button sizes are default/sm/lg/icon; the atom's xs collapses to the smallest (sm). */
const SIZE_TO_UI_SIZE: Record<ButtonSize, UIButtonSize> = {
  xs: "sm",
  sm: "sm",
  md: "default",
  lg: "lg",
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
      variant={toUIVariant(tone, variant)}
      size={SIZE_TO_UI_SIZE[size]}
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
