/**
 * @file Center gallery — playground cases for the Center atom.
 * @description Gallery manifest entry (ratified decision #7): representative
 * static cases with centered text children.
 * @module components/atoms/Center/gallery
 */
import React from "react";

import { Center } from ".";
import { Text } from "../Text";

import type { GalleryEntry } from "../galleryTypes";

export const gallery: GalleryEntry = {
  name: "Center",
  Component: Center as unknown as React.ComponentType<never>,
  cases: [
    {
      title: "centered content",
      props: { className: "h-24 w-full bg-background-100" },
      children: <Text variant="body">Centered</Text>,
    },
    {
      title: "small box",
      props: { className: "h-12 w-32 bg-background-100" },
      children: <Text variant="caption">Centered</Text>,
    },
  ],
};
