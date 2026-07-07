---
name: visual-parity-sweep
description: Capture paired screenshots of two environments (canonically dev vs staging) via comprehensive exploratory usage, then compare them to find visual differences in size, color, shape, and layout. Use when checking for visual regressions between environments, after a design-system or styling change, or when someone reports "dev looks different from staging". Produces a classified findings report that the debug-visual-difference skill consumes.
---

# Visual Parity Sweep

Find visual differences between two deployed environments by capturing the
SAME usage in both and comparing the screenshot pairs. Canonical pairing is
**dev vs staging**, but the harness is parameterized —
local-export-vs-deployed and PR-preview-vs-dev work the same way.

**The one rule that makes comparison possible: capture is paired, not
free-form.** A screenshot is only comparable if both environments performed
the *identical* action sequence at the *identical* viewport. Explore freely
in env A while RECORDING what you did; REPLAY that exact record in env B.
Never explore both environments independently.

## Phase 0 — Pick targets and log in

- Base URLs: use this project's deployed dev/staging URLs. A locally served
  export (`bun run export:web && npx serve dist -l 8082 -s` — the `-s` SPA
  flag is essential) substitutes for either side via `SWEEP_BASE_URL`.
- Authentication: script the login (an API-login fixture under `e2e/` plus a
  storage write is the durable pattern) so every capture run starts from the
  same authenticated state. Use dedicated test users that exist identically
  in both environments.
- Reality check before sweeping: staging often lags dev in schema AND data.
  Some surfaces will legitimately render differently for non-visual reasons.
  That's classification work (Phase 4), not a reason to skip capture.

## Phase 1 — Route × breakpoint baseline (both envs)

Author a committed sweep script (`scripts/design-system/visual-sweep.ts`,
Playwright chromium) that captures every URL-reachable surface of THIS app at
the project's ratified breakpoints (e.g. 375/640/768/1024/1280/1536):

```bash
TEST_ENV=development npx tsx scripts/design-system/visual-sweep.ts
TEST_ENV=staging     npx tsx scripts/design-system/visual-sweep.ts
# output: /tmp/visual-sweep/{development,staging}/<surface>@<width>.png
```

Check the run logs for `FAIL` lines — a missing screenshot on one side is a
finding (capture failure or dead route), not something to silently skip.

## Phase 2 — Author the exploratory manifest (explore env A)

The baseline only sees what a cold page-load shows. Real parity coverage
needs INTERACTION states: modals, drawers, pickers, expanded rows, tab
switches, filled forms, empty states, hover/selection states.

Explore the PRIMARY env (dev) interactively — Playwright MCP browser tools
or a throwaway tsx script — and for every state worth capturing, append an
entry to a manifest JSON (`/tmp/parity/manifest.json`):

```json
[
  { "name": "home-1280", "route": "/", "width": 1280 },
  { "name": "home-settings-modal-1280", "route": "/", "width": 1280,
    "actions": [ { "clickTestId": "open-settings-button" }, { "waitMs": 800 } ] },
  { "name": "search-filled-768", "route": "/search", "width": 768,
    "actions": [ { "fill": ["input[type=text]", "query"] }, { "waitMs": 1500 } ] }
]
```

Action vocabulary (one key per action, executed in order):
`click` (CSS) · `clickText` (exact text) · `clickTestId` · `fill`
(`[selector, value]`) · `press` (key) · `scrollY` (px) · `hover` (CSS) ·
`waitFor` (CSS visible) · `waitMs`.

Manifest-authoring rules learned the hard way:

- **Selector stability beats brevity.** Prefer `clickTestId` — testIDs are
  part of the atom API and exist in both envs. Bare `clickText` labels often
  match non-interactive elements; if a click doesn't change anything,
  capture proves nothing (see verification rule in Phase 3).
- **Name shots `<surface>-<state>-<width>`.** The name is the pairing key
  and the unit of re-verification later.
- **Comprehensive means systematic:** for each surface walk (a) default
  load, (b) each primary action that opens an overlay or changes layout,
  (c) at minimum the 375 / 768 / 1280 widths for interactive states (all six
  for anything suspicious), (d) light AND dark theme if a toggle is
  reachable, (e) empty/error states where you can induce them.
- Keep actions short and deterministic — every extra step is a chance for
  the two envs to diverge for non-visual reasons (data!). Prefer many small
  entries over one long journey.

## Phase 3 — Replay the manifest against BOTH envs

Author a manifest replayer (`scripts/design-system/parity-capture.ts` — same
Playwright setup as the sweep, executing the action vocabulary above), then:

```bash
TEST_ENV=development MANIFEST=/tmp/parity/manifest.json \
  npx tsx scripts/design-system/parity-capture.ts
TEST_ENV=staging     MANIFEST=/tmp/parity/manifest.json \
  npx tsx scripts/design-system/parity-capture.ts
# output: /tmp/parity/{development,staging}/<name>.png
```

Yes — re-capture env A from the manifest too (don't reuse exploration
screenshots): both sides must go through the identical code path, settle
timing (`reducedMotion: reduce`, networkidle + 3.5s, +0.8s after actions),
and viewport.

**Verify the actions actually happened.** A `FAIL` line, or an entry whose
screenshot looks identical to its no-action sibling, means the click/fill
did nothing in that env — the pair is INCONCLUSIVE, not clean. (This exact
false negative once nearly invalidated a production triangulation: clicks
that silently didn't navigate produced "0 errors" on a broken build.) Fix
the selector or drop the entry; never classify from an unverified action.

## Phase 4 — Rank, eyeball, classify

Rank pairs worst-first (dimension mismatches, then % pixels differing):

```bash
node scripts/design-system/parity-diff.mjs \
  /tmp/visual-sweep/development /tmp/visual-sweep/staging --json /tmp/parity/baseline.json
node scripts/design-system/parity-diff.mjs \
  /tmp/parity/development /tmp/parity/staging --json /tmp/parity/exploratory.json
```

The ranker is a candidate-finder, NOT a verdict — live data drift between
envs guarantees false positives. Read each flagged pair side-by-side (the
Read tool renders PNGs) and classify:

| Class | What it looks like | Action |
|---|---|---|
| **Regression** | Structural/style difference in chrome the envs share: shifted layout, wrong color/radius/spacing, missing element, broken overflow, font-size change | File in the report → debug-visual-difference skill |
| **Intentional** | Differences the ratified design system explains: closed-scale snapping (ties round DOWN), semantic-token color shifts, type-scale normalization (docs/design-system-rfc.md) | Record with the justifying anchor; no action |
| **Data drift** | Different players/counts/timestamps/feeds in otherwise identical chrome | Note and move on; consider a tighter entry that avoids the volatile region |
| **Env gap** | A surface that errors or renders empty on one side (missing backend op, org scoping) | Report as an environment finding, not a visual one |

Triage heuristics: data drift changes CONTENT inside stable chrome;
regressions change the CHROME itself. Compare the same surface across
widths — a real style bug usually reproduces at every width, data drift
rarely does. `ORPHAN` lines from the ranker are findings (one-sided capture
failure).

## Phase 5 — Report

Write the findings report (docs/design-system/visual-sweep.md is the
conventional home) with one entry per confirmed or suspected regression:

- shot name + both file paths + viewport
- one-sentence description naming the property that differs (size / color /
  shape / spacing / typography / missing element)
- classification + confidence, and for intentional: the doc anchor that
  ratifies it
- the manifest entry JSON (so the pair is re-runnable in isolation with
  `SWEEP_ONLY=<name>` — this is what the fix loop uses)

Each regression entry is a ready-made input for the
**debug-visual-difference** skill. Keep `/tmp/parity/manifest.json` with the
report — the manifest IS the reproducibility artifact.
