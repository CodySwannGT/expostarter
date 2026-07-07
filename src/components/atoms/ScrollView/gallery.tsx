/**
 * @file ScrollView gallery — playground cases for the ScrollView atom.
 * @description Data-driven gallery entry (ratified decision #7). ScrollView
 * is an open scroll container, so one representative case with overflowing
 * content suffices.
 * @module components/atoms/ScrollView/gallery
 */
import React from "react";

import { Stack } from "../Stack";
import { Text } from "../Text";

import { ScrollView } from ".";

import type { GalleryEntry } from "../galleryTypes";

export const gallery: GalleryEntry = {
  name: "ScrollView",
  Component: ScrollView as unknown as React.ComponentType<never>,
  cases: [
    {
      title: "scrollable content",
      props: {},
      render: () => (
        <ScrollView className="h-32 rounded-sm border border-outline-default">
          <Stack space="2" className="p-2">
            <Text variant="body">Scrollable line 1</Text>
            <Text variant="body">Scrollable line 2</Text>
            <Text variant="body">Scrollable line 3</Text>
            <Text variant="body">Scrollable line 4</Text>
            <Text variant="body">Scrollable line 5</Text>
            <Text variant="body">Scrollable line 6</Text>
            <Text variant="body">Scrollable line 7</Text>
            <Text variant="body">Scrollable line 8</Text>
          </Stack>
        </ScrollView>
      ),
    },
  ],
};
