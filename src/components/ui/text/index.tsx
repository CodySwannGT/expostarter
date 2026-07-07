import React from 'react';

import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils';
import { Text as RNText } from 'react-native';
import { textStyle } from './styles';

type ITextProps = React.ComponentProps<typeof RNText> &
  VariantProps<typeof textStyle> & {
    /**
     * Native RN prop for line-count clamping; exposed explicitly to satisfy
     * TypeScript's type resolution when the GlueStack wrapper's intersection
     * type fails to surface it from `React.ComponentProps<typeof RNText>`.
     */
    numberOfLines?: number;
    /**
     * Native RN prop to disable Android/iOS system font scaling. Exposed
     * explicitly for the same TS-resolution reason as `numberOfLines` above.
     */
    allowFontScaling?: boolean;
    /**
     * Native RN prop to cap the system font-scale multiplier. Exposed
     * explicitly for the same TS-resolution reason as `numberOfLines` above.
     */
    maxFontSizeMultiplier?: number;
  };

const Text = React.forwardRef<React.ComponentRef<typeof RNText>, ITextProps>(
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
      ...props
    },
    ref
  ) {
    return (
      <RNText
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
