// @ts-nocheck
'use client';
import React from 'react';
import { createMenu } from '@gluestack-ui/core/menu/creator';
import { tva } from '@gluestack-ui/utils/nativewind-utils';
import { cssInterop } from 'nativewind';
import { Platform, Pressable, ScrollView as RNScrollView, Text, View, ViewStyle } from 'react-native';
import { GestureHandlerRootView, ScrollView as GHScrollView } from 'react-native-gesture-handler';
import {
  Motion,
  AnimatePresence,
  MotionComponentProps,
} from '@legendapp/motion';
import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils';

type IMotionViewProps = React.ComponentProps<typeof View> &
  MotionComponentProps<typeof View, ViewStyle, unknown, unknown, unknown>;

const MotionView = Motion.View as React.ComponentType<IMotionViewProps>;

/**
 * Static cap for menu dropdown height. Menus with fewer items render
 * at their natural size; longer menus are capped and become scrollable.
 * Set to 200 to stay above the Android navigation bar (~48dp) when
 * shouldFlip's boundary check overestimates available space.
 */
const MENU_SCROLL_MAX_HEIGHT = 200;

/**
 * Prevents the ScrollView content container from expanding beyond its
 * natural size inside the unbounded absolute-positioning chain
 * (Modal → PopoverContent → Animated.View → ScrollView).
 */
const SCROLL_CONTENT_STYLE = { flexGrow: 0 } as const;

/**
 * Overrides GestureHandlerRootView's default `flex: 1` style which
 * creates a circular layout dependency when the parent MotionView is
 * content-sized. Without this, the GestureHandlerRootView tries to
 * fill its parent while the parent tries to size to its children,
 * causing the menu to collapse to zero height.
 */
const GESTURE_ROOT_STYLE = { flex: 0 } as const;

/**
 * Scrollable menu root that caps dropdown height and enables scrolling
 * when the menu has many items.
 *
 * Android uses gesture-handler ScrollView + GestureHandlerRootView because
 * RN Modals create a separate native view hierarchy and core ScrollView has
 * known issues inside Modal on Android (facebook/react-native#48822, #18777).
 *
 * iOS uses RN's standard ScrollView because gesture-handler's ScrollView
 * inside a Modal swallows touch events from child Pressable components,
 * preventing menu item selection.
 *
 * `contentContainerStyle: { flexGrow: 0 }` prevents the content container
 * from expanding beyond its natural size in the unbounded absolute-
 * positioning chain (Modal → PopoverContent → Animated.View → ScrollView).
 * Combined with `maxHeight` on the wrapper View, this provides a
 * deterministic height cap without any measurement, state, or callbacks.
 */
const MenuScrollRoot = React.forwardRef<
  React.ComponentRef<typeof View>,
  IMotionViewProps
>(function MenuScrollRoot({ children, ...props }, ref) {
  const scrollContent = (
    <View style={{ maxHeight: MENU_SCROLL_MAX_HEIGHT }}>
      {Platform.OS === 'android' ? (
        <GHScrollView
          nestedScrollEnabled
          bounces={false}
          contentContainerStyle={SCROLL_CONTENT_STYLE}
        >
          {children}
        </GHScrollView>
      ) : (
        <RNScrollView
          nestedScrollEnabled
          bounces={false}
          contentContainerStyle={SCROLL_CONTENT_STYLE}
          delaysContentTouches={false}
        >
          {children}
        </RNScrollView>
      )}
    </View>
  );

  return (
    <MotionView ref={ref} {...props}>
      {Platform.OS === 'android' ? (
        <GestureHandlerRootView style={GESTURE_ROOT_STYLE}>
          {scrollContent}
        </GestureHandlerRootView>
      ) : (
        scrollContent
      )}
    </MotionView>
  );
});

const menuStyle = tva({
  base: 'rounded-sm bg-surface-base border border-outline-subtle p-1 shadow-hard-5',
});

const menuItemStyle = tva({
  base: 'min-w-48 p-3 flex-row items-center rounded-sm data-[hover=true]:bg-surface-raised data-[active=true]:bg-surface-subtle data-[focus=true]:bg-surface-raised data-[focus=true]:web:outline-none data-[focus=true]:web:outline-0 data-[disabled=true]:opacity-40 data-[disabled=true]:web:cursor-not-allowed data-[focus-visible=true]:web:outline-2 data-[focus-visible=true]:web:outline-primary-700 data-[focus-visible=true]:web:outline data-[focus-visible=true]:web:cursor-pointer data-[disabled=true]:data-[focus=true]:bg-transparent',
});

const menuBackdropStyle = tva({
  base: 'absolute top-0 bottom-0 left-0 right-0 web:cursor-default',
  // add this classnames if you want to give background color to backdrop
  // opacity-50 bg-background-500,
});

const menuSeparatorStyle = tva({
  base: 'bg-surface-muted h-px w-full',
});

const menuItemLabelStyle = tva({
  base: 'text-content-secondary font-normal font-body',

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

const BackdropPressable = React.forwardRef<
  React.ComponentRef<typeof Pressable>,
  React.ComponentPropsWithoutRef<typeof Pressable> &
    VariantProps<typeof menuBackdropStyle>
>(function BackdropPressable({ className, ...props }, ref) {
  return (
    <Pressable
      ref={ref}
      className={menuBackdropStyle({
        class: className,
      })}
      {...props}
    />
  );
});

type IMenuItemProps = VariantProps<typeof menuItemStyle> & {
  className?: string;
} & React.ComponentPropsWithoutRef<typeof Pressable>;

const Item = React.forwardRef<
  React.ComponentRef<typeof Pressable>,
  IMenuItemProps
>(function Item({ className, ...props }, ref) {
  return (
    <Pressable
      ref={ref}
      className={menuItemStyle({
        class: className,
      })}
      {...props}
    />
  );
});

const Separator = React.forwardRef<
  React.ComponentRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View> &
    VariantProps<typeof menuSeparatorStyle>
>(function Separator({ className, ...props }, ref) {
  return (
    <View
      ref={ref}
      className={menuSeparatorStyle({ class: className })}
      {...props}
    />
  );
});
export const UIMenu = createMenu({
  Root: MenuScrollRoot,
  Item: Item,
  Label: Text,
  Backdrop: BackdropPressable,
  AnimatePresence: AnimatePresence,
  Separator: Separator,
});

cssInterop(MotionView, { className: 'style' });

type IMenuProps = React.ComponentProps<typeof UIMenu> &
  VariantProps<typeof menuStyle> & { className?: string };
type IMenuItemLabelProps = React.ComponentProps<typeof UIMenu.ItemLabel> &
  VariantProps<typeof menuItemLabelStyle> & { className?: string };

const Menu = React.forwardRef<React.ComponentRef<typeof UIMenu>, IMenuProps>(
  function Menu({ className, ...props }, ref) {
    return (
      <UIMenu
        ref={ref}
        initial={{
          opacity: 0,
          scale: 0.8,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          scale: 0.8,
        }}
        transition={{
          type: 'timing',
          duration: 100,
        }}
        className={menuStyle({
          class: className,
        })}
        {...props}
      />
    );
  }
);

const MenuItem = UIMenu.Item;

const MenuItemLabel = React.forwardRef<
  React.ComponentRef<typeof UIMenu.ItemLabel>,
  IMenuItemLabelProps
>(function MenuItemLabel(
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
    <UIMenu.ItemLabel
      ref={ref}
      className={menuItemLabelStyle({
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
    />
  );
});

const MenuSeparator = UIMenu.Separator;

Menu.displayName = 'Menu';
MenuItem.displayName = 'MenuItem';
MenuItemLabel.displayName = 'MenuItemLabel';
MenuSeparator.displayName = 'MenuSeparator';
export { Menu, MenuItem, MenuItemLabel, MenuSeparator };
