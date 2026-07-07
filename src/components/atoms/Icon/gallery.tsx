/**
 * @file Icon gallery — playground cases for the Icon atom.
 * @description Data-driven gallery entry (ratified decision #7). Covers every
 * IconSize value (6) with a Lucide icon.
 * @module components/atoms/Icon/gallery
 */
// Per-icon import: the lucide barrel would bundle every icon (~1.1MB) because
// Metro cannot tree-shake it — see lucide-icons.d.ts at the repo root.
import Star from "lucide-react-native/dist/esm/icons/star";

import { Icon } from ".";

import type { GalleryEntry } from "../galleryTypes";
import type React from "react";

export const gallery: GalleryEntry = {
  name: "Icon",
  Component: Icon as unknown as React.ComponentType<never>,
  cases: [
    {
      title: "size=2xs",
      props: { as: Star, size: "2xs" },
    },
    {
      title: "size=xs",
      props: { as: Star, size: "xs" },
    },
    {
      title: "size=sm",
      props: { as: Star, size: "sm" },
    },
    {
      title: "size=md",
      props: { as: Star, size: "md" },
    },
    {
      title: "size=lg",
      props: { as: Star, size: "lg" },
    },
    {
      title: "size=xl",
      props: { as: Star, size: "xl" },
    },
  ],
};
