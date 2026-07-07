/**
 * @file galleryTypes.ts
 * @description Data-driven gallery contract (ratified decision #7). Every
 * atom ships a `gallery.tsx` exporting a GalleryEntry; the /playground route
 * renders the manifest and a CI script asserts completeness (every atom +
 * every variant value has a case).
 * @module components/atoms/galleryTypes
 */
import type React from "react";

/** One named prop combination rendered in the gallery. */
export interface GalleryCase {
  /** Display label, e.g. "tone=danger size=sm". */
  readonly title: string;
  /** Props passed verbatim to the component. */
  readonly props: Record<string, unknown>;
  /** Optional children (string or element). */
  readonly children?: React.ReactNode;
  /**
   * Escape for compound/overlay atoms whose preview can't be expressed as
   * plain props (e.g. Modal content): renders instead of Component+props.
   */
  readonly render?: () => React.ReactNode;
}

/** Gallery manifest entry for one atom. */
export interface GalleryEntry {
  /** Atom name — must match the directory name. */
  readonly name: string;
  /** The atom component. */
  readonly Component: React.ComponentType<never>;
  /** Exhaustive named cases (closed enums → finite grid). */
  readonly cases: readonly GalleryCase[];
}
