import React from 'react';
import { boxStyle } from './styles';

import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils';

type IBoxProps = React.ComponentPropsWithoutRef<'div'> &
  VariantProps<typeof boxStyle> & {
    className?: string;
    /** Test ID for E2E testing - maps to data-testid on web */
    testID?: string;
  };

const Box = React.forwardRef<HTMLDivElement, IBoxProps>(function Box(
  { className, testID, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={boxStyle({ class: className })}
      data-testid={testID}
      {...props}
    />
  );
});

Box.displayName = 'Box';
export { Box };
