/**
 * @file Atom barrel — the design library's public import surface.
 * @description App code imports rendering primitives from here (or from the
 * per-atom paths) and ONLY here: `@/components/ui` and react-native UI
 * primitives are lint-banned outside this directory. Narrowed atoms (Box,
 * Button, Heading, Icon, Input, Pressable, Spinner, Stack, Text) expose
 * closed enum APIs; structured atoms re-export their compound parts
 * verbatim. See docs/design-system-rfc.md.
 * @module components/atoms
 */
export * from "./Box";
export * from "./Button";
export * from "./Center";
export * from "./Divider";
export * from "./Heading";
export * from "./Icon";
export * from "./Input";
export * from "./Pressable";
export * from "./ScrollView";
export * from "./Spinner";
export * from "./Stack";
export * from "./Text";
export type { GalleryCase, GalleryEntry } from "./galleryTypes";
export {
  GAP_CLASS,
  TEXT_VARIANT_CLASS,
  type SpaceToken,
  type TextVariant,
  type WithUnsafeStyle,
} from "./types";
