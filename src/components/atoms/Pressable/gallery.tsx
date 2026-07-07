/**
 * @file Pressable gallery — playground cases for the Pressable atom.
 * @description Data-driven gallery entry (ratified decision #7). Pressable is
 * an open interaction primitive, so representative cases suffice. Children
 * are supplied via the `render` escape (galleries are static composition).
 * @module components/atoms/Pressable/gallery
 */
import React from "react";

import { Text } from "../Text";

import { Pressable } from ".";

import type { GalleryEntry } from "../galleryTypes";

/**
 * Inert press handler for gallery previews (galleries carry no behavior).
 *
 * @returns Nothing
 */
function noopPress(): undefined {
  return undefined;
}

export const gallery: GalleryEntry = {
  name: "Pressable",
  Component: Pressable as unknown as React.ComponentType<never>,
  cases: [
    {
      title: "text row",
      props: { onPress: noopPress },
      render: () => (
        <Pressable onPress={noopPress} className="p-2">
          <Text variant="body">Tap me</Text>
        </Pressable>
      ),
    },
    {
      title: "surface tile",
      props: { onPress: noopPress },
      render: () => (
        <Pressable
          onPress={noopPress}
          className="rounded-sm bg-surface-strong p-4"
        >
          <Text variant="body-strong">Pressable surface</Text>
        </Pressable>
      ),
    },
    {
      title: "disabled",
      props: { onPress: noopPress, disabled: true },
      render: () => (
        <Pressable onPress={noopPress} disabled className="p-2">
          <Text variant="caption">Disabled pressable</Text>
        </Pressable>
      ),
    },
  ],
};
