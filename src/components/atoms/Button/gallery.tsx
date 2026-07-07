/**
 * @file Button gallery — playground cases for the Button atom.
 * @description Data-driven gallery entry (ratified decision #7). Covers every
 * tone (4), variant (3), and size (4), plus loading and icon cases.
 * @module components/atoms/Button/gallery
 */
import { Plus } from "lucide-react-native";

import { Button } from ".";

import type { GalleryEntry } from "../galleryTypes";
import type React from "react";

export const gallery: GalleryEntry = {
  name: "Button",
  Component: Button as unknown as React.ComponentType<never>,
  cases: [
    {
      title: "tone=primary",
      props: { tone: "primary", label: "Primary" },
    },
    {
      title: "tone=secondary",
      props: { tone: "secondary", label: "Secondary" },
    },
    {
      title: "tone=positive",
      props: { tone: "positive", label: "Positive" },
    },
    {
      title: "tone=danger",
      props: { tone: "danger", label: "Danger" },
    },
    {
      title: "variant=solid",
      props: { variant: "solid", label: "Solid" },
    },
    {
      title: "variant=outline",
      props: { variant: "outline", label: "Outline" },
    },
    {
      title: "variant=link",
      props: { variant: "link", label: "Link" },
    },
    {
      title: "size=xs",
      props: { size: "xs", label: "Extra small" },
    },
    {
      title: "size=sm",
      props: { size: "sm", label: "Small" },
    },
    {
      title: "size=md",
      props: { size: "md", label: "Medium" },
    },
    {
      title: "size=lg",
      props: { size: "lg", label: "Large" },
    },
    {
      title: "isLoading",
      props: { isLoading: true, label: "Saving" },
    },
    {
      title: "with leading icon",
      props: { icon: Plus, label: "Add player" },
    },
    {
      title: "with trailing icon",
      props: { icon: Plus, iconPosition: "trailing", label: "Add player" },
    },
  ],
};
