/**
 * @file galleryOverlayCard.tsx
 * @description Static descriptor card for overlay compound atoms in the
 * /playground gallery. Overlay parts (ModalContent, DrawerContent, …) read
 * their parent's style context and crash when rendered standalone, and
 * mounting the live root would portal an overlay over the gallery grid —
 * so overlay families render this card instead.
 * @module components/atoms/galleryOverlayCard
 */
import React from "react";

import { Box } from "./Box";
import { Text } from "./Text";

/**
 * Renders the descriptor card for one overlay compound family.
 *
 * @param props - Card props
 * @param props.name - The overlay family name (e.g. "Modal")
 * @param props.parts - The compound part names the family exports
 * @returns The descriptor card element
 */
export function OverlayGalleryCard({
  name,
  parts,
}: {
  readonly name: string;
  readonly parts: readonly string[];
}): React.ReactElement {
  return (
    <Box className="gap-2 rounded-md border border-outline-default bg-surface-raised p-4">
      <Text variant="body-strong">{name} — overlay compound</Text>
      <Text variant="caption" className="text-content-muted">
        Opens via app flows. Its parts require the live {name} style context and
        cannot render statically. Parts: {parts.join(", ")}.
      </Text>
    </Box>
  );
}
