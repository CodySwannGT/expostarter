/**
 * @file Input gallery — playground cases for the Input atom.
 * @description Data-driven gallery entry (ratified decision #7). Covers every
 * variant (3) and size (4), plus a leading-icon case.
 * @module components/atoms/Input/gallery
 */
// Per-icon import: the lucide barrel would bundle every icon (~1.1MB) because
// Metro cannot tree-shake it — see lucide-icons.d.ts at the repo root.
import Search from "lucide-react-native/dist/esm/icons/search";

import { Input } from ".";

import type { GalleryEntry } from "../galleryTypes";
import type React from "react";

export const gallery: GalleryEntry = {
  name: "Input",
  Component: Input as unknown as React.ComponentType<never>,
  cases: [
    {
      title: "variant=outline",
      props: { variant: "outline", field: { placeholder: "Outline input" } },
    },
    {
      title: "variant=underlined",
      props: {
        variant: "underlined",
        field: { placeholder: "Underlined input" },
      },
    },
    {
      title: "variant=rounded",
      props: { variant: "rounded", field: { placeholder: "Rounded input" } },
    },
    {
      title: "size=sm",
      props: { size: "sm", field: { placeholder: "Small input" } },
    },
    {
      title: "size=md",
      props: { size: "md", field: { placeholder: "Medium input" } },
    },
    {
      title: "size=lg",
      props: { size: "lg", field: { placeholder: "Large input" } },
    },
    {
      title: "size=xl",
      props: { size: "xl", field: { placeholder: "Extra large input" } },
    },
    {
      title: "with leading icon",
      props: {
        leadingIcon: Search,
        field: { placeholder: "Search players…" },
      },
    },
  ],
};
