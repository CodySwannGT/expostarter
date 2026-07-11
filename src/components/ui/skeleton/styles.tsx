// @ts-nocheck
import { tva } from '@gluestack-ui/utils/nativewind-utils';

export const skeletonStyle = tva({
  base: 'w-full h-full rounded-sm',
  variants: {
    variant: {
      sharp: 'rounded-none',
      circular: 'rounded-full',
      rounded: 'rounded-md',
    },
    speed: {
      1: 'duration-750',
      // Local fix: the v5 template shipped `duration-100` here, making the speed
      // map non-monotonic (750→100→1500→2000) and inconsistent with the sibling
      // skeletonTextStyle (which uses duration-1000 for speed 2). Snap to 1000.
      2: 'duration-1000',
      3: 'duration-1500',
      4: 'duration-2000',
    },
  },
});
export const skeletonTextStyle = tva({
  base: 'rounded-sm w-full',
  variants: {
    speed: {
      1: 'duration-750',
      2: 'duration-1000',
      3: 'duration-1500',
      4: 'duration-2000',
    },
    gap: {
      1: 'gap-1',
      2: 'gap-2',
      3: 'gap-3',
      4: 'gap-4',
    },
  },
});