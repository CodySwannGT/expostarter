// @ts-nocheck
import React from 'react';
import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils';
import { textStyle } from './styles';

type ITextProps = React.ComponentProps<'span'> &
  VariantProps<typeof textStyle> & {
// Cross-platform parity: accept the React Native-only `numberOfLines` prop
    // on web too, so callers that use the `truncate + numberOfLines={1}` pattern
    // don't need `@ts-expect-error` or casts. The prop is swallowed before reaching
    // the DOM; web clamping comes from the existing `truncate` class.
    numberOfLines?: number;
    // Cross-platform parity for Android/iOS font-scaling caps. Swallowed on web
    // (no system font scaling there); kept in the type so callers don't need casts.
    allowFontScaling?: boolean;
    maxFontSizeMultiplier?: number;
  };

const Text = React.forwardRef<React.ComponentRef<'span'>, ITextProps>(
  function Text(
    {
      className,
      isTruncated,
      bold,
      underline,
      strikeThrough,
      size = 'md',
      sub,
      italic,
      highlight,
      numberOfLines: _numberOfLines,
      ...props
    }: { className?: string } & ITextProps,
    ref
  ) {
    return (
      <span
        className={textStyle({
          isTruncated: isTruncated as boolean,
          bold: bold as boolean,
          underline: underline as boolean,
          strikeThrough: strikeThrough as boolean,
          size,
          sub: sub as boolean,
          italic: italic as boolean,
          highlight: highlight as boolean,
          class: className,
        })}
        {...props}
        ref={ref}
      />
    );
  }
);

Text.displayName = 'Text';

export { Text };
