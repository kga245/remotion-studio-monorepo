# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.2] - 2026-04-11

Brush-up pass on the shared utility packages under `packages/@studio/*`:
deduplicate types, reuse logic across packages, fix a handful of small bugs,
and add the missing `@studio/hooks` test suite so the general-purpose utility
layer has a single source of truth.

### Added

- `@studio/timing`: optional `label?: string` field on `TimingSegment`.
- `@studio/timing`: regression test covering zero-length ranges in `getProgress`.
- `@studio/hooks`: 32 new unit tests covering every hook module, with mocked
  Remotion `useCurrentFrame` / `useVideoConfig`.
- `@studio/hooks`: `test` / `test:watch` npm scripts.
- `@studio/easings`: `Number.isFinite` validation on `cubicBezier` control
  points so `NaN` inputs fail fast instead of looping.

### Changed

- `@studio/core-types`: `EasingFunction` and `TimingSegment` are now type
  re-exports from their owning packages (`@studio/easings`, `@studio/timing`)
  instead of duplicate local definitions. Consumers see the same types.
- `@studio/hooks`: `useFrameProgress`, `useTimeProgress`, `useVideoProgress`,
  `useSegment`, `useActiveSegment`, and `useDelayedMountByTime` now delegate
  to `@studio/timing`'s `getProgress` / `isInSegment` / `getLocalFrame` /
  `secondsToFrames`. Single source of truth for the math.
- `@studio/hooks`: `SegmentConfig` is now a back-compat type alias for
  `TimingSegment` from `@studio/timing`.
- `@studio/easings`: `cubicBezier` no longer has the stale "binary search"
  comment on the Newton–Raphson loop; `sampleCurveX/Y` drop their dead
  `(1 - t)^3 * 0` and `t^3 * 1` terms.

### Fixed

- `@studio/hooks`: `useSegment` now returns `progress: 0` before the segment
  starts and `progress: 1` after it ends (previously returned `0` in both
  cases, making the value ambiguous without also checking `isActive`).
- `@studio/hooks`: `useSegment` handles zero-duration segments without
  emitting `NaN`.

### Removed / Breaking

These are breaking at the source level but do not affect any current
consumer in this repository (the only in-tree consumer is
`apps/examples/animations-showcase`, which uses neither signature).

- `@studio/timing`: `clampFrame(frame, min, max)` both positional arguments
  are required. Previously `min` had a default of `0` while `max` was still
  required, which made the default unusable.
- `@studio/hooks`: `useDelayedMountByTime(startSeconds)` no longer takes an
  `fps` argument. `fps` is read from `useVideoConfig()`, matching the style
  of `useTimeProgress`.
- `@studio/easings`: the first parameter of `steps()` was renamed from
  `steps` to `stepCount` to stop shadowing the outer function name. Callers
  that pass positionally are unaffected; named-argument callers (if any)
  must update.

### Verification

- `pnpm test` — 58 passing (32 new + 26 existing).
- `pnpm typecheck` — 10/10 turbo tasks.
- `pnpm build:packages` — all 5 packages build.
- `apps/examples/animations-showcase` compiles cleanly.

## [0.1.1] - 2026-04-08

### Changed

- Forge Studio dashboard UX refresh:
  - Reorganized project cards around one primary action.
  - Moved heavy operations into a side control panel.
  - Simplified the header and added Japanese / English toggle.
  - Added a short getting-started guide for first-time use.
  - Updated README docs for the new Studio flow.

[0.1.2]: https://github.com/Takamasa045/remotion-studio-monorepo/releases/tag/v0.1.2
[0.1.1]: https://github.com/Takamasa045/remotion-studio-monorepo/releases/tag/v0.1.1
