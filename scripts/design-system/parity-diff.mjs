/**
 * Visual parity diff ranker (visual-parity-sweep skill, phase 4).
 *
 * Pairs same-named PNGs across two directories and ranks the pairs by how
 * different they are, so a human (or agent) eyeballs the WORST pairs first
 * instead of all of them:
 *
 *   - dimension mismatches rank highest (layout/size regressions);
 *   - otherwise pairs rank by % of pixels whose max per-channel delta
 *     exceeds a noise threshold (anti-aliasing tolerance).
 *
 * This is deliberately a RANKER, not a verdict: live data drifts between
 * environments, so a high score is a candidate, never a confirmed
 * regression. Classification stays with the reviewer.
 *
 * Usage:
 *   node scripts/design-system/parity-diff.mjs <dirA> <dirB> [--json <out>]
 *     [--threshold <0-255, default 24>] [--min-pct <default 0.5>]
 *
 * Output: one line per pair, sorted worst-first, plus orphans (files present
 * on one side only — usually a capture failure, never silently ignored).
 * Plain node ESM; pngjs is already in node_modules.
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import { PNG } from "pngjs";

const args = process.argv.slice(2);
const dirs = args.filter(a => !a.startsWith("--"));
const flag = name => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? undefined : args[i + 1];
};

if (dirs.length !== 2) {
  console.error(
    "usage: node parity-diff.mjs <dirA> <dirB> [--json out] [--threshold n] [--min-pct n]"
  );
  process.exit(2);
}
const [dirA, dirB] = dirs;
const THRESHOLD = Number(flag("threshold") ?? 24);
const MIN_PCT = Number(flag("min-pct") ?? 0.5);
const JSON_OUT = flag("json");

/**
 * List the PNG filenames in a directory.
 * @param {string} dir Directory to list
 * @returns {string[]} Sorted PNG filenames
 */
const pngs = dir =>
  fs
    .readdirSync(dir)
    .filter(f => f.endsWith(".png"))
    .sort();

/**
 * Compare one same-named pair of PNGs.
 * @param {string} name Shared filename
 * @returns {{name: string, kind: string, pct?: number, detail: string}}
 *   Comparison result: kind is "dimension" | "pixels" | "identical"
 */
function comparePair(name) {
  const a = PNG.sync.read(fs.readFileSync(path.join(dirA, name)));
  const b = PNG.sync.read(fs.readFileSync(path.join(dirB, name)));
  if (a.width !== b.width || a.height !== b.height) {
    return {
      name,
      kind: "dimension",
      detail: `${a.width}x${a.height} vs ${b.width}x${b.height}`,
    };
  }
  let diff = 0;
  const total = a.width * a.height;
  for (let i = 0; i < a.data.length; i += 4) {
    const d = Math.max(
      Math.abs(a.data[i] - b.data[i]),
      Math.abs(a.data[i + 1] - b.data[i + 1]),
      Math.abs(a.data[i + 2] - b.data[i + 2])
    );
    if (d > THRESHOLD) diff += 1;
  }
  const pct = (diff / total) * 100;
  return pct === 0
    ? { name, kind: "identical", pct, detail: "0%" }
    : { name, kind: "pixels", pct, detail: `${pct.toFixed(2)}% pixels differ` };
}

const namesA = pngs(dirA);
const namesB = pngs(dirB);
const shared = namesA.filter(n => namesB.includes(n));
const orphans = [
  ...namesA.filter(n => !namesB.includes(n)).map(n => `${n} (only in ${dirA})`),
  ...namesB.filter(n => !namesA.includes(n)).map(n => `${n} (only in ${dirB})`),
];

const results = shared.map(comparePair);
const ranked = results
  .filter(r => r.kind === "dimension" || (r.pct ?? 0) >= MIN_PCT)
  .sort((x, y) => {
    if (x.kind === "dimension" && y.kind !== "dimension") return -1;
    if (y.kind === "dimension" && x.kind !== "dimension") return 1;
    return (y.pct ?? 0) - (x.pct ?? 0);
  });

for (const r of ranked) {
  console.log(
    `${r.kind === "dimension" ? "DIM " : "DIFF"} ${r.name}  ${r.detail}`
  );
}
console.log(
  `\n${ranked.length} candidate pair(s) of ${shared.length} compared ` +
    `(threshold=${THRESHOLD}, min-pct=${MIN_PCT})`
);
for (const o of orphans) console.log(`ORPHAN ${o}`);

if (JSON_OUT) {
  fs.writeFileSync(
    JSON_OUT,
    JSON.stringify({ ranked, orphans, compared: shared.length }, null, 2)
  );
  console.log(`json: ${JSON_OUT}`);
}
process.exit(orphans.length > 0 ? 1 : 0);
