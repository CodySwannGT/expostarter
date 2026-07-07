/**
 * @file Divider gallery — playground cases for the Divider atom.
 * @description Enumerates the orientation variant values as gallery cases for
 * the /playground manifest (RFC decision #7).
 * @module components/atoms/Divider/gallery
 */
import type React from "react";

import type { GalleryEntry } from "../galleryTypes";

import { Divider } from ".";

export const gallery: GalleryEntry = {
  name: "Divider",
  Component: Divider as unknown as React.ComponentType<never>,
  cases: [
    {
      title: "orientation=horizontal",
      props: { orientation: "horizontal" },
    },
    {
      title: "orientation=vertical",
      props: { orientation: "vertical" },
    },
  ],
};
