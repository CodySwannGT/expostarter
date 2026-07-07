/**
 * @file Text gallery — playground cases for the Text atom.
 * @description Data-driven gallery entry (ratified decision #7). Covers all
 * 12 ratified TextVariant values, one case per variant.
 * @module components/atoms/Text/gallery
 */
import type React from "react";

import { Text } from ".";

import type { GalleryEntry } from "../galleryTypes";

export const gallery: GalleryEntry = {
  name: "Text",
  Component: Text as unknown as React.ComponentType<never>,
  cases: [
    {
      title: "variant=micro",
      props: { variant: "micro" },
      children: "The quick brown fox jumps over the lazy dog",
    },
    {
      title: "variant=caption",
      props: { variant: "caption" },
      children: "The quick brown fox jumps over the lazy dog",
    },
    {
      title: "variant=body",
      props: { variant: "body" },
      children: "The quick brown fox jumps over the lazy dog",
    },
    {
      title: "variant=body-strong",
      props: { variant: "body-strong" },
      children: "The quick brown fox jumps over the lazy dog",
    },
    {
      title: "variant=title-sm",
      props: { variant: "title-sm" },
      children: "The quick brown fox",
    },
    {
      title: "variant=title",
      props: { variant: "title" },
      children: "The quick brown fox",
    },
    {
      title: "variant=title-lg",
      props: { variant: "title-lg" },
      children: "The quick brown fox",
    },
    {
      title: "variant=display-sm",
      props: { variant: "display-sm" },
      children: "Quick brown fox",
    },
    {
      title: "variant=display-md",
      props: { variant: "display-md" },
      children: "Quick brown fox",
    },
    {
      title: "variant=display-lg",
      props: { variant: "display-lg" },
      children: "Quick brown",
    },
    {
      title: "variant=display-xl",
      props: { variant: "display-xl" },
      children: "Quick brown",
    },
    {
      title: "variant=display-2xl",
      props: { variant: "display-2xl" },
      children: "Quick",
    },
  ],
};
