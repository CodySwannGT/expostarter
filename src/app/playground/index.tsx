/**
 * @file Playground gallery route (RFC §6, ratified decision #7).
 * @description Renders every atom gallery entry from the generated
 * galleryManifest — one section per atom, one labelled block per case —
 * as the design library's source of truth ("if it isn't in the gallery,
 * it doesn't exist").
 *
 * Theme coverage: a header toggle flips the app theme via useTheme. A
 * side-by-side double-render was rejected because on web the
 * GluestackUIProvider applies its mode globally (:root CSS variables +
 * documentElement class), so two nested providers cannot show two themes
 * at once; the toggle drives the real provider tree instead.
 *
 * Production access is gated in ./_layout.tsx (redirects to not-found).
 * @module app/playground
 */
import React from "react";

import {
  Button,
  Heading,
  Stack,
  Text,
  type GalleryCase,
  type GalleryEntry,
} from "@/components/atoms";
import { galleryManifest } from "@/components/atoms/galleryManifest";
import { ScrollView } from "@/components/atoms/ScrollView";
import ErrorBoundary from "@/components/molecules/ErrorBoundary";
import { useTheme } from "@/providers/ThemeProvider";

/**
 * Loose component type used to spread data-driven gallery props.
 * GalleryEntry types Component as ComponentType<never>; rendering with
 * arbitrary case props requires widening to a string-keyed prop bag.
 */
type GalleryComponent = React.ComponentType<
  React.PropsWithChildren<Record<string, unknown>>
>;

/**
 * Props for a single rendered gallery case block.
 */
interface CaseBlockProps {
  /** Owning atom name (for the e2e-stable testID). */
  readonly entryName: string;
  /** The gallery case to render. */
  readonly caseItem: GalleryCase;
  /** Case position within the entry (for the testID). */
  readonly index: number;
  /** The atom component, widened for prop spreading. */
  readonly Component: GalleryComponent;
}

/**
 * Inline fallback card shown when a gallery case throws (a bad compound
 * preview would otherwise blank the whole route).
 * @param props - Fallback props
 * @param props.label - The "<atom> · <case>" label that failed
 * @returns The error card
 */
const CaseFallback = ({ label }: { readonly label: string }) => (
  <Stack
    space="2"
    className="rounded-sm border border-status-error bg-status-error-surface p-3"
  >
    <Text variant="body-strong" className="text-status-error">
      {label} failed to render
    </Text>
    <Text variant="caption" className="text-content-secondary">
      Fix the atom&apos;s gallery.tsx — its case throws during render.
    </Text>
  </Stack>
);

/**
 * Renders one labelled gallery case: the case title plus either the case's
 * custom render() output or the component with the case props/children.
 * @param props - Case block props
 * @param props.entryName - Owning atom name
 * @param props.caseItem - The gallery case to render
 * @param props.index - Case position within the entry
 * @param props.Component - The atom component, widened for prop spreading
 * @returns The labelled case block
 */
const CaseBlock = ({
  entryName,
  caseItem,
  index,
  Component,
}: CaseBlockProps) => (
  <Stack space="2" testID={`playground-case-${entryName}-${index}`}>
    <Text variant="caption" className="text-content-muted">
      {caseItem.title}
    </Text>
    <ErrorBoundary
      fallback={<CaseFallback label={`${entryName} · ${caseItem.title}`} />}
    >
      {caseItem.render ? (
        caseItem.render()
      ) : (
        <Component {...caseItem.props}>{caseItem.children}</Component>
      )}
    </ErrorBoundary>
  </Stack>
);

/**
 * Props for one atom section of the gallery.
 */
interface EntrySectionProps {
  /** The manifest entry (atom name + component + cases). */
  readonly entry: GalleryEntry;
}

/**
 * Renders one atom's gallery section: the atom name as a heading and every
 * case as a labelled block on a raised surface.
 * @param props - Entry section props
 * @param props.entry - The manifest entry to render
 * @returns The atom section
 */
const EntrySection = ({ entry }: EntrySectionProps) => {
  const Component = entry.Component as GalleryComponent;
  return (
    <Stack
      space="4"
      testID={`playground-entry-${entry.name}`}
      className="rounded-sm border border-outline-default bg-surface-raised p-4"
    >
      <Heading variant="title">{entry.name}</Heading>
      {entry.cases.map((caseItem, index) => (
        <CaseBlock
          key={`${entry.name}-${index}-${caseItem.title}`}
          entryName={entry.name}
          caseItem={caseItem}
          index={index}
          Component={Component}
        />
      ))}
    </Stack>
  );
};

/**
 * The /playground page: scrollable list of every atom gallery section with
 * a theme toggle in the header.
 * @returns The playground gallery page
 */
const Playground = () => {
  const { resolvedTheme, toggleTheme } = useTheme();
  return (
    <ScrollView className="flex-1 bg-surface-base" testID="playground-scroll">
      <Stack space="6" className="p-6">
        <Stack
          direction="horizontal"
          space="4"
          className="items-center justify-between"
        >
          <Heading variant="title-lg">Playground</Heading>
          <Button
            label={`Theme: ${resolvedTheme}`}
            variant="outline"
            tone="secondary"
            size="sm"
            onPress={toggleTheme}
            testID="playground-theme-toggle"
          />
        </Stack>
        {galleryManifest.length === 0 ? (
          <Text variant="body" className="text-content-muted">
            No gallery entries yet — add a gallery.tsx next to an atom and run
            scripts/design-system/generate-gallery-manifest.mjs.
          </Text>
        ) : (
          galleryManifest.map(entry => (
            <EntrySection key={entry.name} entry={entry} />
          ))
        )}
      </Stack>
    </ScrollView>
  );
};

export default Playground;
