/**
 * @file Box gallery — playground cases for the Box atom.
 * @description Data-driven gallery entry (ratified decision #7). Box is an
 * open container primitive, so representative surface/layout cases suffice.
 * @module components/atoms/Box/gallery
 */
import React from "react";

import { Text } from "../Text";

import { Box } from ".";

import type { GalleryEntry } from "../galleryTypes";

export const gallery: GalleryEntry = {
  name: "Box",
  Component: Box as unknown as React.ComponentType<never>,
  cases: [
    {
      title: "surface block",
      props: { className: "size-16 rounded-md bg-surface-strong" },
    },
    {
      title: "padded surface with text child",
      props: {},
      render: () => (
        <Box className="rounded-md bg-surface-strong p-4">
          <Text variant="body">Boxed content</Text>
        </Box>
      ),
    },
    {
      title: "bordered container",
      props: { className: "h-12 w-32 rounded-md border border-outline-200" },
    },
  ],
};
