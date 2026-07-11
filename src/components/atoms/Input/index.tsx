/**
 * @file Input atom — data-driven text field (RFC §3).
 * @description Narrows the Gluestack compound Input: callers pass data
 * (value, placeholder, icons), never InputField/InputSlot trees.
 * @module components/atoms/Input
 */
import React from "react";

import {
  Input as UIInput,
  InputField,
  InputIcon,
  InputSlot,
} from "@/components/ui/input";

import type { WithUnsafeStyle } from "../types";

/**
 *
 */
type UIInputProps = React.ComponentProps<typeof UIInput>;
/**
 *
 */
type UIInputFieldProps = React.ComponentProps<typeof InputField>;
/**
 *
 */
type IconComponent = React.ElementType;

/**
 *
 */
export type InputVariant = "outline" | "underlined" | "rounded";
/**
 *
 */
export type InputSize = "sm" | "md" | "lg" | "xl";

/**
 *
 */
export interface InputProps
  extends
    Omit<UIInputProps, "variant" | "size" | "style" | "children">,
    WithUnsafeStyle<UIInputProps["style"]> {
  variant?: InputVariant;
  size?: InputSize;
  /** Optional leading icon (Lucide). */
  leadingIcon?: IconComponent;
  /** Optional trailing icon (Lucide), pressable via onTrailingIconPress. */
  trailingIcon?: IconComponent;
  /** Press handler for the trailing icon slot (e.g. clear / reveal). */
  onTrailingIconPress?: () => void;
  /** Props forwarded to the inner text field (value, onChangeText, …). */
  field: Omit<UIInputFieldProps, "children">;
}

const Input = React.forwardRef<React.ComponentRef<typeof UIInput>, InputProps>(
  function Input(
    {
      // v5 Input has no variant/size axis; kept in the public API for stability
      // and stripped from `...props` (renamed to satisfy no-unused-vars).
      variant: _variant = "outline",
      size: _size = "md",
      leadingIcon,
      trailingIcon,
      onTrailingIconPress,
      field,
      UNSAFE_style,
      ...props
    },
    ref
  ) {
    // Gluestack v5's Input has a single style (no `variant`/`size` axis). The
    // atom keeps `variant`/`size` in its public API for stability, but they no
    // longer map to a vendored prop; destructuring them above strips them from
    // `...props` so they are not forwarded to UIInput.
    // TODO(design-system): reintroduce size/variant styling via the vendored
    // input tva (text scale / border treatment) if brand parity requires it.
    return (
      <UIInput ref={ref} style={UNSAFE_style} {...props}>
        {leadingIcon ? (
          <InputSlot className="pl-3">
            <InputIcon as={leadingIcon} />
          </InputSlot>
        ) : null}
        <InputField {...field} />
        {trailingIcon ? (
          <InputSlot className="pr-3" onPress={onTrailingIconPress}>
            <InputIcon as={trailingIcon} />
          </InputSlot>
        ) : null}
      </UIInput>
    );
  }
);

Input.displayName = "Input";

export { Input };
