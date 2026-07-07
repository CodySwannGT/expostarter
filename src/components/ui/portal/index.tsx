'use client';
import React from 'react';
import { Overlay } from '@gluestack-ui/core/overlay/creator';
import { cssInterop } from 'nativewind';
import {
  Portal as GorhomPortal,
  PortalHost,
  PortalProvider,
} from '@gorhom/portal';

cssInterop(Overlay, { className: 'style' });

const Portal = React.forwardRef<
  React.ComponentRef<typeof Overlay>,
  React.ComponentProps<typeof Overlay>
>(function Portal({ ...props }, ref) {
  return <Overlay {...props} ref={ref} />;
});

Portal.displayName = 'Portal';

/**
 * Portal name constant for player detail center scoped modals
 * @remarks Used to render modals within the player detail content area only,
 * not covering the full screen/sidebars
 */
export const PLAYER_DETAIL_PORTAL = "player-detail-portal";

export { Portal, GorhomPortal, PortalHost, PortalProvider };
