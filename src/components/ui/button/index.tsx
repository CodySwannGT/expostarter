// @ts-nocheck
'use client';
import { createButton } from '@gluestack-ui/core/button/creator';
import { UIIcon } from '@gluestack-ui/core/icon/creator';
import {
  tva,
  useStyleContext,
  withStyleContext,
  type VariantProps,
} from '@gluestack-ui/utils/nativewind-utils';
import { styled } from 'nativewind';
import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

// LOCAL (design-system): this vendored gluestack-v5 Button keeps the v3 API the
// sealed atom layer depends on — `action` (intent) x `variant` (style) x `size`
// with the project's semantic/raw tokens — instead of v5's shadcn variant set.
// The atom Button (src/components/atoms/Button) maps its frozen public
// tone/variant/size onto these. Do not "simplify" to stock v5 without updating
// the atom + galleries. (`rounded` -> `rounded-md` under Tailwind 4.)
const SCOPE = 'BUTTON';
const Root = withStyleContext(Pressable, SCOPE);
const StyledUIIcon = styled(UIIcon, {
  className: 'style',
});
const UIButton = createButton({
  Root: Root,
  Text,
  Group: View,
  Spinner: ActivityIndicator,
  Icon: StyledUIIcon,
});
const buttonStyle = tva({
  base: 'group/button rounded-md bg-primary-500 flex-row items-center justify-center data-[focus-visible=true]:web:outline-none data-[focus-visible=true]:web:ring-2 data-[disabled=true]:opacity-40 gap-2',
  variants: {
    action: {
      primary:
        'bg-primary-500 data-[hover=true]:bg-primary-600 data-[active=true]:bg-primary-700 border-primary-300 data-[hover=true]:border-primary-400 data-[active=true]:border-primary-500 data-[focus-visible=true]:web:ring-indicator-info',
      secondary:
        'bg-secondary-500 border-secondary-300 data-[hover=true]:bg-secondary-600 data-[hover=true]:border-secondary-400 data-[active=true]:bg-secondary-700 data-[active=true]:border-secondary-700 data-[focus-visible=true]:web:ring-indicator-info',
      positive:
        'bg-success-500 border-success-300 data-[hover=true]:bg-success-600 data-[hover=true]:border-success-400 data-[active=true]:bg-success-700 data-[active=true]:border-success-500 data-[focus-visible=true]:web:ring-indicator-info',
      negative:
        'bg-error-500 border-error-300 data-[hover=true]:bg-error-600 data-[hover=true]:border-error-400 data-[active=true]:bg-error-700 data-[active=true]:border-error-500 data-[focus-visible=true]:web:ring-indicator-info',
      default:
        'bg-transparent data-[hover=true]:bg-surface-raised data-[active=true]:bg-transparent',
    },
    variant: {
      link: 'px-0',
      outline:
        'bg-transparent border data-[hover=true]:bg-surface-raised data-[active=true]:bg-transparent',
      solid: '',
    },
    size: {
      xs: 'px-3 h-8',
      sm: 'px-4 h-9',
      md: 'px-5 h-10',
      lg: 'px-6 h-11',
      // SE-5256: the closed spacing scale removed step `7`, so the original
      // `px-7` compiled to nothing and every size="xl" button rendered with
      // zero horizontal padding. Snap 28px -> `px-6` (ties round down).
      xl: 'px-6 h-12',
    },
  },
  compoundVariants: [
    {
      action: 'primary',
      variant: 'link',
      class:
        'px-0 bg-transparent data-[hover=true]:bg-transparent data-[active=true]:bg-transparent',
    },
    {
      action: 'secondary',
      variant: 'link',
      class:
        'px-0 bg-transparent data-[hover=true]:bg-transparent data-[active=true]:bg-transparent',
    },
    {
      action: 'positive',
      variant: 'link',
      class:
        'px-0 bg-transparent data-[hover=true]:bg-transparent data-[active=true]:bg-transparent',
    },
    {
      action: 'negative',
      variant: 'link',
      class:
        'px-0 bg-transparent data-[hover=true]:bg-transparent data-[active=true]:bg-transparent',
    },
    {
      action: 'primary',
      variant: 'outline',
      class:
        'bg-transparent data-[hover=true]:bg-surface-raised data-[active=true]:bg-transparent',
    },
    {
      action: 'secondary',
      variant: 'outline',
      class:
        'bg-transparent data-[hover=true]:bg-surface-raised data-[active=true]:bg-transparent',
    },
    {
      action: 'positive',
      variant: 'outline',
      class:
        'bg-transparent data-[hover=true]:bg-surface-raised data-[active=true]:bg-transparent',
    },
    {
      action: 'negative',
      variant: 'outline',
      class:
        'bg-transparent data-[hover=true]:bg-surface-raised data-[active=true]:bg-transparent',
    },
  ],
});
const buttonTextStyle = tva({
  base: 'text-content-inverse font-semibold web:select-none',
  parentVariants: {
    action: {
      primary:
        'text-primary-600 data-[hover=true]:text-primary-600 data-[active=true]:text-primary-700',
      secondary:
        'text-content-muted data-[hover=true]:text-content-secondary data-[active=true]:text-content-secondary',
      positive:
        'text-success-600 data-[hover=true]:text-success-600 data-[active=true]:text-success-700',
      negative:
        'text-error-600 data-[hover=true]:text-error-600 data-[active=true]:text-error-700',
    },
    variant: {
      link: 'data-[hover=true]:underline data-[active=true]:underline',
      outline: '',
      solid:
        'text-content-inverse data-[hover=true]:text-content-inverse data-[active=true]:text-content-inverse',
    },
    size: {
      xs: 'text-caption',
      sm: 'text-body',
      md: 'text-title-sm',
      lg: 'text-title',
      xl: 'text-title-lg',
    },
  },
  parentCompoundVariants: [
    {
      variant: 'solid',
      action: 'primary',
      class:
        'text-content-inverse data-[hover=true]:text-content-inverse data-[active=true]:text-content-inverse',
    },
    {
      variant: 'solid',
      action: 'secondary',
      class:
        'text-content-primary data-[hover=true]:text-content-primary data-[active=true]:text-content-primary',
    },
    {
      variant: 'solid',
      action: 'positive',
      class:
        'text-content-inverse data-[hover=true]:text-content-inverse data-[active=true]:text-content-inverse',
    },
    {
      variant: 'solid',
      action: 'negative',
      class:
        'text-content-inverse data-[hover=true]:text-content-inverse data-[active=true]:text-content-inverse',
    },
    {
      variant: 'outline',
      action: 'primary',
      class:
        'text-primary-500 data-[hover=true]:text-primary-500 data-[active=true]:text-primary-500',
    },
    {
      variant: 'outline',
      action: 'secondary',
      class:
        'text-content-muted data-[hover=true]:text-primary-600 data-[active=true]:text-content-secondary',
    },
    {
      variant: 'outline',
      action: 'positive',
      class:
        'text-primary-500 data-[hover=true]:text-primary-500 data-[active=true]:text-primary-500',
    },
    {
      variant: 'outline',
      action: 'negative',
      class:
        'text-primary-500 data-[hover=true]:text-primary-500 data-[active=true]:text-primary-500',
    },
  ],
});

const buttonSpinnerStyle = tva({
  base: '',
  parentVariants: {
    size: {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      md: 'h-4 w-4',
      lg: 'h-4 w-4',
      xl: 'h-5 w-5',
    },
  },
});

const buttonIconStyle = tva({
  base: 'fill-none',
  parentVariants: {
    variant: {
      link: 'data-[hover=true]:underline data-[active=true]:underline',
      outline: '',
      solid:
        'text-content-inverse data-[hover=true]:text-content-inverse data-[active=true]:text-content-inverse',
    },
    size: {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      md: 'h-4 w-4',
      lg: 'h-4 w-4',
      xl: 'h-5 w-5',
    },
    action: {
      primary:
        'text-primary-600 data-[hover=true]:text-primary-600 data-[active=true]:text-primary-700',
      secondary:
        'text-content-muted data-[hover=true]:text-content-secondary data-[active=true]:text-content-secondary',
      positive:
        'text-success-600 data-[hover=true]:text-success-600 data-[active=true]:text-success-700',
      negative:
        'text-error-600 data-[hover=true]:text-error-600 data-[active=true]:text-error-700',
    },
  },
  parentCompoundVariants: [
    {
      variant: 'solid',
      action: 'primary',
      class:
        'text-content-inverse data-[hover=true]:text-content-inverse data-[active=true]:text-content-inverse',
    },
    {
      variant: 'solid',
      action: 'secondary',
      class:
        'text-content-primary data-[hover=true]:text-content-primary data-[active=true]:text-content-primary',
    },
    {
      variant: 'solid',
      action: 'positive',
      class:
        'text-content-inverse data-[hover=true]:text-content-inverse data-[active=true]:text-content-inverse',
    },
    {
      variant: 'solid',
      action: 'negative',
      class:
        'text-content-inverse data-[hover=true]:text-content-inverse data-[active=true]:text-content-inverse',
    },
  ],
});
const buttonGroupStyle = tva({
  base: '',
  variants: {
    space: {
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-3',
      lg: 'gap-4',
      xl: 'gap-5',
    },
    isAttached: {
      true: 'gap-0',
    },
    flexDirection: {
      row: 'flex-row',
      column: 'flex-col',
      'row-reverse': 'flex-row-reverse',
      'column-reverse': 'flex-col-reverse',
    },
  },
});
type IButtonProps = Omit<
  React.ComponentPropsWithoutRef<typeof UIButton>,
  'context'
> &
  VariantProps<typeof buttonStyle> & { className?: string };
const Button = React.forwardRef<
  React.ElementRef<typeof UIButton>,
  IButtonProps
>(
  (
    { className, variant = 'solid', size = 'md', action = 'primary', ...props },
    ref
  ) => {
    return (
      <UIButton
        ref={ref}
        {...props}
        className={buttonStyle({ variant, size, action, class: className })}
        context={{ variant, size, action }}
      />
    );
  }
);
type IButtonTextProps = React.ComponentPropsWithoutRef<typeof UIButton.Text> &
  VariantProps<typeof buttonTextStyle> & { className?: string };
const ButtonText = React.forwardRef<
  React.ElementRef<typeof UIButton.Text>,
  IButtonTextProps
>(({ className, size, ...props }, ref) => {
  const {
    size: parentSize,
    variant: parentVariant,
    action: parentAction,
  } = useStyleContext(SCOPE);
  return (
    <UIButton.Text
      ref={ref}
      {...props}
      className={buttonTextStyle({
        parentVariants: {
          size: parentSize,
          variant: parentVariant,
          action: parentAction,
        },
        size,
        class: className,
      })}
    />
  );
});
const ButtonSpinner = React.forwardRef<
  React.ElementRef<typeof UIButton.Spinner>,
  React.ComponentPropsWithoutRef<typeof UIButton.Spinner>
>(({ className, ...props }, ref) => {
  const { size: parentSize } = useStyleContext(SCOPE);
  return (
    <UIButton.Spinner
      ref={ref}
      {...props}
      className={buttonSpinnerStyle({
        parentVariants: { size: parentSize },
        class: className,
      })}
    />
  );
});
type IButtonIcon = React.ComponentPropsWithoutRef<typeof UIButton.Icon> &
  VariantProps<typeof buttonIconStyle> & {
    className?: string | undefined;
    as?: React.ElementType;
    height?: number;
    width?: number;
  };
const ButtonIcon = React.forwardRef<
  React.ElementRef<typeof UIButton.Icon>,
  IButtonIcon
>(({ className, size, ...props }, ref) => {
  const {
    size: parentSize,
    variant: parentVariant,
    action: parentAction,
  } = useStyleContext(SCOPE);
  if (typeof size === 'number') {
    return (
      <UIButton.Icon
        ref={ref}
        {...props}
        className={buttonIconStyle({ class: className })}
        size={size}
      />
    );
  } else if (
    (props.height !== undefined || props.width !== undefined) &&
    size === undefined
  ) {
    return (
      <UIButton.Icon
        ref={ref}
        {...props}
        className={buttonIconStyle({ class: className })}
      />
    );
  }
  return (
    <UIButton.Icon
      {...props}
      className={buttonIconStyle({
        parentVariants: {
          size: parentSize,
          variant: parentVariant,
          action: parentAction,
        },
        size,
        class: className,
      })}
      ref={ref}
    />
  );
});
type IButtonGroupProps = React.ComponentPropsWithoutRef<typeof UIButton.Group> &
  VariantProps<typeof buttonGroupStyle>;
const ButtonGroup = React.forwardRef<
  React.ElementRef<typeof UIButton.Group>,
  IButtonGroupProps
>(
  (
    {
      className,
      space = 'md',
      isAttached = false,
      flexDirection = 'column',
      ...props
    },
    ref
  ) => {
    return (
      <UIButton.Group
        className={buttonGroupStyle({
          class: className,
          space,
          isAttached,
          flexDirection,
        })}
        {...props}
        ref={ref}
      />
    );
  }
);
Button.displayName = 'Button';
ButtonText.displayName = 'ButtonText';
ButtonSpinner.displayName = 'ButtonSpinner';
ButtonIcon.displayName = 'ButtonIcon';
ButtonGroup.displayName = 'ButtonGroup';
export { Button, ButtonGroup, ButtonIcon, ButtonSpinner, ButtonText };
