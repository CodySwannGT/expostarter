/**
 * @file Spinner gallery — playground cases for the Spinner atom.
 * @description Data-driven gallery entry (ratified decision #7). Spinner has
 * no closed enum props; representative size cases suffice.
 * @module components/atoms/Spinner/gallery
 */
import type React from "react";

import { Spinner } from ".";

import type { GalleryEntry } from "../galleryTypes";

export const gallery: GalleryEntry = {
  name: "Spinner",
  Component: Spinner as unknown as React.ComponentType<never>,
  cases: [
    {
      title: "default",
      props: {},
    },
    {
      title: "size=small",
      props: { size: "small" },
    },
    {
      title: "size=large",
      props: { size: "large" },
    },
  ],
};
