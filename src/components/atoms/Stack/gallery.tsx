/**
 * @file Stack gallery — playground cases for the Stack atom.
 * @description Data-driven gallery entry (ratified decision #7). Covers both
 * directions and every ratified SpaceToken at least once. Children are
 * supplied via the `render` escape (galleries are static composition).
 * @module components/atoms/Stack/gallery
 */
import React from "react";

import { Box } from "../Box";

import { Stack } from ".";

import type { GalleryEntry } from "../galleryTypes";

/**
 * Renders three fixed-size Box children used to visualize Stack gaps.
 *
 * @returns Three square surface blocks
 */
function stackChildren(): React.ReactNode {
  return (
    <>
      <Box className="size-4 bg-surface-strong" />
      <Box className="size-4 bg-surface-strong" />
      <Box className="size-4 bg-surface-strong" />
    </>
  );
}

export const gallery: GalleryEntry = {
  name: "Stack",
  Component: Stack as unknown as React.ComponentType<never>,
  cases: [
    {
      title: "vertical space=0",
      props: { direction: "vertical", space: "0" },
      render: () => (
        <Stack direction="vertical" space="0">
          {stackChildren()}
        </Stack>
      ),
    },
    {
      title: "vertical space=micro",
      props: { direction: "vertical", space: "micro" },
      render: () => (
        <Stack direction="vertical" space="micro">
          {stackChildren()}
        </Stack>
      ),
    },
    {
      title: "vertical space=1",
      props: { direction: "vertical", space: "1" },
      render: () => (
        <Stack direction="vertical" space="1">
          {stackChildren()}
        </Stack>
      ),
    },
    {
      title: "vertical space=2",
      props: { direction: "vertical", space: "2" },
      render: () => (
        <Stack direction="vertical" space="2">
          {stackChildren()}
        </Stack>
      ),
    },
    {
      title: "vertical space=3",
      props: { direction: "vertical", space: "3" },
      render: () => (
        <Stack direction="vertical" space="3">
          {stackChildren()}
        </Stack>
      ),
    },
    {
      title: "vertical space=4",
      props: { direction: "vertical", space: "4" },
      render: () => (
        <Stack direction="vertical" space="4">
          {stackChildren()}
        </Stack>
      ),
    },
    {
      title: "horizontal space=5",
      props: { direction: "horizontal", space: "5" },
      render: () => (
        <Stack direction="horizontal" space="5">
          {stackChildren()}
        </Stack>
      ),
    },
    {
      title: "horizontal space=6",
      props: { direction: "horizontal", space: "6" },
      render: () => (
        <Stack direction="horizontal" space="6">
          {stackChildren()}
        </Stack>
      ),
    },
    {
      title: "horizontal space=8",
      props: { direction: "horizontal", space: "8" },
      render: () => (
        <Stack direction="horizontal" space="8">
          {stackChildren()}
        </Stack>
      ),
    },
    {
      title: "horizontal space=10",
      props: { direction: "horizontal", space: "10" },
      render: () => (
        <Stack direction="horizontal" space="10">
          {stackChildren()}
        </Stack>
      ),
    },
    {
      title: "horizontal space=12",
      props: { direction: "horizontal", space: "12" },
      render: () => (
        <Stack direction="horizontal" space="12">
          {stackChildren()}
        </Stack>
      ),
    },
    {
      title: "horizontal space=16",
      props: { direction: "horizontal", space: "16" },
      render: () => (
        <Stack direction="horizontal" space="16">
          {stackChildren()}
        </Stack>
      ),
    },
  ],
};
