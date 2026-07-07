'use client';
import { createLink } from '@gluestack-ui/core/link/creator';
import { Pressable } from 'react-native';
import { Text } from 'react-native';

import { tva } from '@gluestack-ui/utils/nativewind-utils';
import { withStyleContext } from '@gluestack-ui/utils/nativewind-utils';
import { cssInterop } from 'nativewind';
import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils';

import React from 'react';
export const UILink = createLink({
  Root: withStyleContext(Pressable),
  Text: Text,
});

cssInterop(UILink, { className: 'style' });
cssInterop(UILink.Text, { className: 'style' });

const linkStyle = tva({
  base: 'group/link web:outline-0 data-[disabled=true]:web:cursor-not-allowed data-[focus-visible=true]:web:ring-2 data-[focus-visible=true]:web:ring-indicator-primary data-[focus-visible=true]:web:outline-0 data-[disabled=true]:opacity-4 ',
});

const linkTextStyle = tva({
  base: 'underline text-info-700 data-[hover=true]:text-info-600 data-[hover=true]:no-underline data-[active=true]:text-info-700 font-normal font-body web:font-sans web:tracking-sm web:my-0 web:bg-transparent web:border-0 web:box-border web:display-inline web:list-none web:margin-0 web:padding-0 web:position-relative web:text-start web:whitespace-pre-wrap web:word-wrap-break-word',

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

type ILinkProps = React.ComponentProps<typeof UILink> &
  VariantProps<typeof linkStyle> & { className?: string };

const Link = React.forwardRef<React.ComponentRef<typeof UILink>, ILinkProps>(
  function Link({ className, ...props }, ref) {
    return (
      <UILink
        ref={ref}
        {...props}
        className={linkStyle({ class: className })}
      />
    );
  }
);

type ILinkTextProps = React.ComponentProps<typeof UILink.Text> &
  VariantProps<typeof linkTextStyle> & { className?: string };

const LinkText = React.forwardRef<
  React.ComponentRef<typeof UILink.Text>,
  ILinkTextProps
>(function LinkText({ className, size = 'md', ...props }, ref) {
  return (
    <UILink.Text
      ref={ref}
      {...props}
      className={linkTextStyle({
        class: className,
        size,
      })}
    />
  );
});

Link.displayName = 'Link';
LinkText.displayName = 'LinkText';

export { Link, LinkText };
