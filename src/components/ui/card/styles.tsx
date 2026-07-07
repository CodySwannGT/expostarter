import { tva } from '@gluestack-ui/utils/nativewind-utils';
import { isWeb } from '@gluestack-ui/utils/nativewind-utils';
const baseStyle = isWeb ? 'flex flex-col relative z-0' : '';

export const cardStyle = tva({
  base: baseStyle,
  variants: {
    size: {
      sm: 'p-3 rounded-sm',
      md: 'p-4 rounded-sm',
      lg: 'p-6 rounded-lg',
    },
    variant: {
      elevated: 'bg-surface-base',
      outline: 'border border-outline-default ',
      ghost: 'rounded-none',
      filled: 'bg-surface-raised',
    },
  },
});
