/**
 * @file Heading gallery — playground cases for the Heading atom.
 * @description Data-driven gallery entry (ratified decision #7). Covers all
 * 8 HeadingVariant values (title/display ladder), one case per variant.
 * @module components/atoms/Heading/gallery
 */
import type React from "react";

import { Heading } from ".";

import type { GalleryEntry } from "../galleryTypes";

export const gallery: GalleryEntry = {
  name: "Heading",
  Component: Heading as unknown as React.ComponentType<never>,
  cases: [
    {
      title: "variant=title-sm",
      props: { variant: "title-sm" },
      children: "Section heading",
    },
    {
      title: "variant=title",
      props: { variant: "title" },
      children: "Section heading",
    },
    {
      title: "variant=title-lg",
      props: { variant: "title-lg" },
      children: "Section heading",
    },
    {
      title: "variant=display-sm",
      props: { variant: "display-sm" },
      children: "Display heading",
    },
    {
      title: "variant=display-md",
      props: { variant: "display-md" },
      children: "Display heading",
    },
    {
      title: "variant=display-lg",
      props: { variant: "display-lg" },
      children: "Display",
    },
    {
      title: "variant=display-xl",
      props: { variant: "display-xl" },
      children: "Display",
    },
    {
      title: "variant=display-2xl",
      props: { variant: "display-2xl" },
      children: "Display",
    },
  ],
};
