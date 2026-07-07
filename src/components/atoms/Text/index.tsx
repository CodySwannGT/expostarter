/**
 * @file Text atom — bound to the ratified type scale (RFC §3).
 * @description The only public text primitive. `variant` applies a bundled
 * text style (size + line-height + family/weight). className stays open for
 * color/layout tokens; the vocabulary is closed by theme + lint.
 * @module components/atoms/Text
 */
import React from "react";

import { Text as UIText } from "@/components/ui/text";

import {
  TEXT_VARIANT_CLASS,
  type TextVariant,
  type WithUnsafeStyle,
} from "../types";

/**
 *
 */
type UITextProps = React.ComponentProps<typeof UIText>;

/**
 *
 */
export interface TextProps
  extends
    Omit<UITextProps, "size" | "style">,
    WithUnsafeStyle<UITextProps["style"]> {
  /** Ratified text style bundle. Omit to inherit the local className sizing. */
  variant?: TextVariant;
  /** Test/a11y identity is part of the atom API (RFC standing constraint 4). */
  testID?: string;
}

const Text = React.forwardRef<React.ComponentRef<typeof UIText>, TextProps>(
  function Text({ variant, className, UNSAFE_style, ...props }, ref) {
    const bundle = variant ? TEXT_VARIANT_CLASS[variant] : undefined;
    const { testID } = props;
    return (
      <UIText
        ref={ref}
        className={bundle ? `${bundle} ${className ?? ""}`.trim() : className}
        style={UNSAFE_style}
        // web Text renders a raw span; emit data-testid for the e2e contract
        {...(testID ? ({ "data-testid": testID } as object) : {})}
        {...props}
      />
    );
  }
);

Text.displayName = "Text";

export { Text };
