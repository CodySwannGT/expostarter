---
name: debug-visual-difference
description: Debug and fix a confirmed visual difference between two environments (or between a build and its design spec) — trace the difference to the owning layer (token, atom, call-site, build pipeline), fix it there, and prove the pair now matches. Use after visual-parity-sweep classifies a regression, or whenever a specific surface "looks wrong" compared to a reference.
---

# Debug a Visual Difference

Input: ONE confirmed visual difference — ideally a visual-parity-sweep report
entry (shot name, pair of screenshots, viewport, re-runnable manifest entry).
Output: a fix at the layer that OWNS the difference, plus re-captured proof
that the pair now matches.

## Step 0 — Make it cheap to reproduce

Don't iterate against deploys. Serve the current code locally against the
dev backend and re-capture just this shot:

```bash
bun run export:web && npx serve dist -l 8082 -s   # -s SPA flag essential
SWEEP_BASE_URL=http://localhost:8082 SWEEP_OUT=local SWEEP_ONLY=<shot-name> \
  MANIFEST=/tmp/parity/manifest.json npx tsx scripts/design-system/parity-capture.ts
```

Two traps that have burned real sessions:

- **Metro cache serves stale bundles.** A hot edit may not appear until
  `expo export` runs with a cleared cache — if a fix "doesn't work",
  suspect the bundle before the fix.
- **Local node_modules may not match the lockfile** (worktrees symlink it;
  bootstrap merges drift it). If local can't reproduce a deployed
  difference at all, run the build-pipeline check (Step 4) before touching
  styles.

## Step 1 — Name the property, find the element

State precisely what differs: size / color / shape (radius) / spacing /
typography / position / missing element. Then find the element:

- Grep the literal user-visible string near the difference (fastest, and it
  verifies you're on the surface the user actually sees — not a sibling
  pipeline that renders similar UI).
- Map route → page: `src/app/<route>` → feature screen → organisms/molecules
  (Container/View pattern) → atoms.

## Step 2 — Diff the rendered styles, not the source

Open both environments side by side (Playwright MCP), locate the element in
each, and compare what the browser actually computed:

```js
// browser_evaluate on each env
const el = document.querySelector('<selector>');
JSON.stringify({
  cls: el.className,
  ...Object.fromEntries(['fontSize','lineHeight','color','backgroundColor',
    'borderRadius','padding','margin','gap','width','height','flexShrink']
    .map(p => [p, getComputedStyle(el)[p]]))
})
```

Three possible shapes of the answer, each pointing at a different layer:

1. **Same classes, different computed values** → token layer or CSS
   generation (Step 3a) — or you're comparing different builds (Step 4).
2. **Different classes** → call-site or atom-variant change (Step 3b/3c).
3. **Class present in `className` but its declaration missing/overridden** →
   class didn't compile, or a merge utility dropped it (Step 3d) — the
   subtlest and most common false trail.

## Step 3 — Fix at the owning layer (lowest layer that explains it)

### 3a. Token values — `tailwind.config.js`

Semantic colors alias CSS vars in
`src/components/ui/gluestack-ui-provider/config.ts` (light AND dark blocks —
an inverted light/dark pair has shipped as a "wrong color" bug). Spacing /
radius / sizing are closed scales; text styles live in `fontSize`. If a
migrated value snapped to the wrong rung, remember: ties round DOWN; a tie
rounded up is a real regression even though it looks "close".

### 3b. Atom variants — `src/components/atoms/`

Reproduce in the `/playground` gallery route (dev builds): if the atom
looks wrong there in isolation, fix the atom/variant and the gallery case
proves it; if the atom looks right in the gallery but wrong on the surface,
the bug is the call-site or a context (theme, parent layout) — don't patch
the atom.

### 3c. Call sites

Wrong/removed class during migration, margin where the parent's `space`/gap
should own spacing, flex constraints. Known platform parity trap: Gluestack
web `Box` lacked RNW View's `flex-shrink:0` — shrink/overflow differences
between web and native point at `src/components/ui/box/styles.tsx`-style
base-class parity, not the call site.

### 3d. The class-eating pipeline (check BEFORE "fixing" styles)

- **tailwind-merge drops custom font-size classes**: it classifies unknown
  `text-*` tokens as COLORS, so a color class later in the merge silently
  deletes `text-display-*`/`text-title-*` etc. This shipped an app-wide
  heading shrink in a sibling project. Custom text tokens must be registered
  in tailwind-merge's font-size classGroup (via a
  `patches/@gluestack-ui+utils*.patch`, covering tva AND cn). Any new
  text-style token needs that registration updated.
- **Class doesn't compile**: the closed theme means off-scale classes
  (`min-w-1/2` on an axis without fractions, fractional spacing steps)
  produce NO css. Verify: start the app once, then `grep '<class>'
  node_modules/.cache/nativewind/global.css`.
- A class can also be legitimately present but beaten by a Gluestack
  `data-[...]` selector — atom-internal; fix in the atom's tva config.

### Step 4 — Build-pipeline differences (when styles aren't the bug)

If the SAME commit renders differently deployed vs locally, stop debugging
CSS. Compare the served bundles: fetch each env's
`/_expo/static/js/web/index-*.js` (+ `.js.map`) and diff the source-map
`sources` lists and module counts — different dependency trees or a corrupted
module graph mean a build/cache problem (a stale cached lockfile shadowing
the committed one once broke navigation for weeks while every local build was
clean). That class of fix belongs in the deploy pipeline / infrastructure
repo, not in this repo's styles.

## Step 5 — Prove the fix

1. Re-capture the single pair locally:
   `SWEEP_ONLY=<shot-name>` against the local export and the reference env;
   re-rank with `node scripts/design-system/parity-diff.mjs <localOut>
   <referenceOut>` — the pair should drop out of the candidates (or visibly
   match on Read; data drift may keep a small pixel score).
2. Sweep the blast radius: a token/atom/patch fix is global — re-run the
   Phase-1 baseline sweep against the local export and confirm no OTHER pair
   got worse. Zero-visual-change discipline applies anywhere the fix touches
   surfaces that were previously correct.
3. Run the repo gates: `bun run typecheck`, `bun run test <touched-areas>`,
   `bun run lint` (includes the design-system rules), and
   `bun run design:manifest` if any atom/gallery changed.
4. If the difference was user-reported: verify on the surface they named,
   with the literal string they saw — never only on the surface the RCA
   suggested.

## Anti-patterns

- "Fixing" a difference whose class is **intentional** (snap rounding,
  ratified token shift) — check the sweep report classification and
  `docs/design-system-rfc.md` before changing anything.
- Patching the call site when the atom/token owns the value (or vice
  versa) — the fix layer is the layer that explains ALL instances of the
  difference, not just the reported one.
- Adding `UNSAFE_style` or a lint suppression to force a match — the escape
  hatch is budgeted and suppressions need a `--` justification; fix the
  owning layer instead.
- Iterating against deploys when a local export reproduces the bug in
  minutes.
- Declaring victory from one screenshot: no blast-radius sweep, no themes,
  no breakpoints.
