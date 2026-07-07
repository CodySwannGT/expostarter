import { tva } from '@gluestack-ui/utils/nativewind-utils';
import { isWeb } from '@gluestack-ui/utils/nativewind-utils';

const baseStyle = isWeb
  ? 'font-sans tracking-sm my-0 bg-transparent border-0 box-border display-inline list-none margin-0 padding-0 position-relative text-start no-underline whitespace-pre-wrap word-wrap-break-word'
  : '';

export const textStyle = tva({
  base: `text-typography-700 font-body ${baseStyle}`,

  variants: {
    isTruncated: {
      true: 'web:truncate',
    },
    bold: {
      true: 'font-bold',
    },
    underline: {
      true: 'underline',
    },
    strikeThrough: {
      true: 'line-through',
    },
    size: {
      '2xs': 'text-micro',
      'xs': 'text-caption',
      'sm': 'text-body',
      'md': 'text-title-sm',
      'lg': 'text-title',
      'xl': 'text-title-lg',
      '2xl': 'text-display-sm',
      '3xl': 'text-display-md',
      '4xl': 'text-display-lg',
      '5xl': 'text-display-xl',
      '6xl': 'text-display-2xl',
    },
    sub: {
      true: 'text-caption',
    },
    italic: {
      true: 'italic',
    },
    highlight: {
      true: 'bg-yellow-500',
    },
  },
});
