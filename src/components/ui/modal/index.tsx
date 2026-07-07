// @ts-nocheck
'use client';
import React, { useEffect, useState } from 'react';
import { createModal } from '@gluestack-ui/core/modal/creator';
import { Platform, Pressable, View, ScrollView, ViewStyle } from 'react-native';
import {
  Motion,
  AnimatePresence,
  createMotionAnimatedComponent,
  MotionComponentProps,
} from '@legendapp/motion';
import { tva } from '@gluestack-ui/utils/nativewind-utils';
import {
  withStyleContext,
  useStyleContext,
} from '@gluestack-ui/utils/nativewind-utils';
import { cssInterop } from 'nativewind';
import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils';
import { KeyboardEvents } from 'react-native-keyboard-controller';

type IAnimatedPressableProps = React.ComponentProps<typeof Pressable> &
  MotionComponentProps<typeof Pressable, ViewStyle, unknown, unknown, unknown>;

const AnimatedPressable = createMotionAnimatedComponent(
  Pressable
) as React.ComponentType<IAnimatedPressableProps>;
const SCOPE = 'MODAL';

type IMotionViewProps = React.ComponentProps<typeof View> &
  MotionComponentProps<typeof View, ViewStyle, unknown, unknown, unknown>;

const MotionView = Motion.View as React.ComponentType<IMotionViewProps>;

const UIModal = createModal({
  Root: withStyleContext(View, SCOPE),
  Backdrop: AnimatedPressable,
  Content: MotionView,
  Body: ScrollView,
  CloseButton: Pressable,
  Footer: View,
  Header: View,
  AnimatePresence: AnimatePresence,
});

cssInterop(AnimatedPressable, { className: 'style' });
cssInterop(MotionView, { className: 'style' });

/**
 * Tracks keyboard height using react-native-keyboard-controller events.
 * Replaces gluestack's built-in useKeyboardBottomInset which breaks on Android
 * when KeyboardProvider sets softInputMode to ADJUST_NOTHING (edge-to-edge).
 * Returns the full keyboard height so ModalContent can shrink accordingly.
 */
function useKeyboardHeight(): number {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (Platform.OS === 'web') return undefined;

    const showSub = KeyboardEvents.addListener('keyboardDidShow', (e) => {
      setHeight(e.height);
    });
    const hideSub = KeyboardEvents.addListener('keyboardDidHide', () => {
      setHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return height;
}

const modalStyle = tva({
  base: 'group/modal w-full h-full justify-center items-center web:pointer-events-none',
  variants: {
    size: {
      xs: '',
      sm: '',
      md: '',
      lg: '',
      full: '',
    },
  },
});

const modalBackdropStyle = tva({
  base: 'absolute left-0 top-0 right-0 bottom-0 bg-surface-inverse web:cursor-default',
});

const modalContentStyle = tva({
  base: 'bg-surface-base rounded-sm overflow-hidden border border-outline-subtle shadow-hard-2 p-6',
  parentVariants: {
    // SE-5240: the design-system tier codemod (commit 266dcca8c) snapped every
    // size's max-width onto the ladder ceiling `max-w-96` (384px) because the
    // closed sizing ladder had no rung above 384px to absorb the original
    // 360/420/510/640px caps. That silently narrowed every md/lg modal (e.g. the
    // Settings > Active Team "Select active team" picker) far below its
    // pre-migration width — still live on Staging — compressing search fields
    // and result rows. The width caps are genuine layout geometry rather than a
    // snap-table token, so the original per-size caps are restored as arbitrary
    // values, permitted in this vendored ui/ layer (eslint
    // `tailwindcss/no-arbitrary-value` and the design-system ratchet both
    // exclude `src/components/ui/**`). Fixes the whole md/lg modal family at the
    // source instead of per-modal inline-style band-aids.
    size: {
      xs: 'w-3/5 max-w-[360px]',
      sm: 'w-2/3 max-w-[420px]',
      md: 'w-4/5 max-w-[510px]',
      lg: 'w-[90%] max-w-[640px]',
      full: 'w-full',
    },
  },
});

const modalBodyStyle = tva({
  base: 'mt-2 mb-6',
});

const modalCloseButtonStyle = tva({
  base: 'group/modal-close-button z-10 rounded data-[focus-visible=true]:web:bg-background-100 web:outline-0 cursor-pointer',
});

const modalHeaderStyle = tva({
  base: 'justify-between items-center flex-row',
});

const modalFooterStyle = tva({
  base: 'flex-row justify-end items-center gap-2',
});

type IModalProps = React.ComponentProps<typeof UIModal> &
  VariantProps<typeof modalStyle> & { className?: string; avoidKeyboard?: boolean };

type IModalBackdropProps = React.ComponentProps<typeof UIModal.Backdrop> &
  VariantProps<typeof modalBackdropStyle> & { className?: string };

type IModalContentProps = React.ComponentProps<typeof UIModal.Content> &
  VariantProps<typeof modalContentStyle> & { className?: string };

type IModalHeaderProps = React.ComponentProps<typeof UIModal.Header> &
  VariantProps<typeof modalHeaderStyle> & { className?: string };

type IModalBodyProps = React.ComponentProps<typeof UIModal.Body> &
  VariantProps<typeof modalBodyStyle> & { className?: string };

type IModalFooterProps = React.ComponentProps<typeof UIModal.Footer> &
  VariantProps<typeof modalFooterStyle> & { className?: string };

type IModalCloseButtonProps = React.ComponentProps<typeof UIModal.CloseButton> &
  VariantProps<typeof modalCloseButtonStyle> & { className?: string };

const Modal = React.forwardRef<React.ComponentRef<typeof UIModal>, IModalProps>(
  ({ className, size = 'md', avoidKeyboard, children, ...props }, ref) => {
    const keyboardHeight = useKeyboardHeight();
    const paddingStyle = avoidKeyboard && keyboardHeight > 0
      ? { paddingBottom: keyboardHeight }
      : undefined;

    return (
      <UIModal
        ref={ref}
        {...props}
        pointerEvents="box-none"
        className={modalStyle({ size, class: className })}
        context={{ size }}
        style={paddingStyle}
      >
        {children}
      </UIModal>
    );
  }
);

const ModalBackdrop = React.forwardRef<
  React.ComponentRef<typeof UIModal.Backdrop>,
  IModalBackdropProps
>(function ModalBackdrop({ className, ...props }, ref) {
  return (
    <UIModal.Backdrop
      ref={ref}
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 0.5,
      }}
      exit={{
        opacity: 0,
      }}
      transition={{
        type: 'spring',
        damping: 18,
        stiffness: 250,
        opacity: {
          type: 'timing',
          duration: 250,
        },
      }}
      {...props}
      className={modalBackdropStyle({
        class: className,
      })}
    />
  );
});

const ModalContent = React.forwardRef<
  React.ComponentRef<typeof UIModal.Content>,
  IModalContentProps
>(function ModalContent({ className, size, ...props }, ref) {
  const { size: parentSize } = useStyleContext(SCOPE);

  return (
    <UIModal.Content
      ref={ref}
      initial={{
        opacity: 0,
        scale: 0.9,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      exit={{
        opacity: 0,
      }}
      transition={{
        type: 'spring',
        damping: 18,
        stiffness: 250,
        opacity: {
          type: 'timing',
          duration: 250,
        },
      }}
      {...props}
      className={modalContentStyle({
        parentVariants: {
          size: parentSize,
        },
        size,
        class: className,
      })}
      pointerEvents="auto"
    />
  );
});

const ModalHeader = React.forwardRef<
  React.ComponentRef<typeof UIModal.Header>,
  IModalHeaderProps
>(function ModalHeader({ className, ...props }, ref) {
  return (
    <UIModal.Header
      ref={ref}
      {...props}
      className={modalHeaderStyle({
        class: className,
      })}
    />
  );
});

const ModalBody = React.forwardRef<
  React.ComponentRef<typeof UIModal.Body>,
  IModalBodyProps
>(function ModalBody({ className, style, ...props }, ref) {
  return (
    <UIModal.Body
      ref={ref}
      {...props}
      style={[Platform.OS !== 'web' ? { flexGrow: 0 } : undefined, style]}
      className={modalBodyStyle({
        class: className,
      })}
    />
  );
});

const ModalFooter = React.forwardRef<
  React.ComponentRef<typeof UIModal.Footer>,
  IModalFooterProps
>(function ModalFooter({ className, ...props }, ref) {
  return (
    <UIModal.Footer
      ref={ref}
      {...props}
      className={modalFooterStyle({
        class: className,
      })}
    />
  );
});

const ModalCloseButton = React.forwardRef<
  React.ComponentRef<typeof UIModal.CloseButton>,
  IModalCloseButtonProps
>(function ModalCloseButton({ className, ...props }, ref) {
  return (
    <UIModal.CloseButton
      ref={ref}
      {...props}
      className={modalCloseButtonStyle({
        class: className,
      })}
    />
  );
});

Modal.displayName = 'Modal';
ModalBackdrop.displayName = 'ModalBackdrop';
ModalContent.displayName = 'ModalContent';
ModalHeader.displayName = 'ModalHeader';
ModalBody.displayName = 'ModalBody';
ModalFooter.displayName = 'ModalFooter';
ModalCloseButton.displayName = 'ModalCloseButton';

export {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  ModalFooter,
};
