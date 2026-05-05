# BOL Remotion Demo — Overnight Build Progress

> Self-documenting log for resumption across context clears. Read this top-to-bottom to pick up where the prior agent left off.

## Mission

Kelly asked for an expansive set of Remotion capability scenes (audition pool for selecting tomorrow), each in its own file, drawn from the wide corpus of Remotion docs/skills/community examples, with a companion show-and-tell presentation. Permission granted to commit liberally and clear context as needed.

## Top-level rules

- **Always commit-clean before clearing context.** No half-files in the working tree at clear-time.
- **Use port 3001** for studio (already running in background — if dead, start with `npx remotion studio --port 3001` from `apps/bol-remotion-demo/`).
- **Conventional commits, no scope** (the repo's commitlint scope-enum doesn't include any value that fits this app).
- **BOL palette only** for visual styling: Graphite `#353D50`, Orange `#F85E32`, Cyan `#7BEDF8`, Gray `#8B8586`, Light Gray `#EEEEEE`, White. Roboto via `@remotion/google-fonts`.
- **One scene per file**, in `src/scenes/`. Each scene is a `<VignetteFrame>`-wrapped component. The frame's API tag should name the actual Remotion API(s) it demonstrates.
- **Render-verification matters**: don't claim "done" without seeing the scene in the browser at localhost:3001 OR producing a single-frame PNG via `npx remotion still`.

## Phase plan

1. ⬜ **Research** — Read the 44-file skill pack at `.agents/skills/remotion-best-practices/`, mine community URLs, build IDEAS.md.
2. ⬜ **Refactor existing** — Split the inline `TitleCard` out of `Showcase.tsx` into `scenes/Title.tsx`. Keep the existing 6 standalone scenes as-is.
3. ⬜ **Build new scenes** — Aim for 15–20 new scenes spanning diverse capability categories.
4. ⬜ **Verify each** — Browser screenshot or still-frame render.
5. ⬜ **Compose** — Update `Showcase.tsx` to optionally include all scenes (with a flag, or via a separate "kitchen sink" composition).
6. ⬜ **Companion presentation** — Build `PRESENTATION.md` (and optionally a Remotion-rendered Pres.tsx) that Kelly can use to show staff.
7. ⬜ **Final commit** — Single push-ready state with PRESENTATION.md, all scenes, working studio.

## Scene inventory (status tracker)

| #   | Scene file                | Category    | Status                                        | Verified?                  |
| --- | ------------------------- | ----------- | --------------------------------------------- | -------------------------- |
| 1   | `Title.tsx`               | Foundations | ⬜ Not started (currently inline in Showcase) | ❌                         |
| 2   | `SpringVsInterpolate.tsx` | Foundations | ✅ Existing                                   | ⚠️ pre-existing, re-verify |
| 3   | `SequencedText.tsx`       | Text        | ✅ Existing                                   | ⚠️                         |
| 4   | `PathsAndShapes.tsx`      | Visuals     | ✅ Existing                                   | ⚠️                         |
| 5   | `AudioCaptions.tsx`       | Media       | ✅ Existing                                   | ⚠️                         |
| 6   | `LottieScene.tsx`         | External    | ✅ Existing                                   | ⚠️                         |
| 7   | `ThreeScene.tsx`          | 3D          | ✅ Existing                                   | ⚠️                         |
| 8   | `Outro.tsx`               | Foundations | ✅ Existing                                   | ⚠️                         |

(Append new rows as scenes are added.)

## How a successor agent should resume

1. Read this file.
2. Read `IDEAS.md` for the full corpus of scene ideas + research notes.
3. Run `git status` — should be clean. If not, commit the in-progress state first as `wip:` with a note.
4. Look at the scene inventory table — pick the next ⬜ row, build it, verify, commit, mark ✅, repeat.
5. Don't add scenes that aren't on the IDEAS.md list without updating it first.
