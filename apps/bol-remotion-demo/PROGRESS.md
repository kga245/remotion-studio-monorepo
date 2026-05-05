# BOL Remotion Demo — Overnight Build Progress

> Self-documenting log for resumption across context clears. Read this top-to-bottom to pick up where the prior agent left off.

## Status: ✅ Complete

The audition pool is built and verified. See `PRESENTATION.md` for the show-and-tell deck.

## Mission

Kelly asked for an expansive set of Remotion capability scenes (audition pool for selecting tomorrow), each in its own file, drawn from the wide corpus of Remotion docs / skills / community examples, with a companion show-and-tell presentation. Permission granted to commit liberally and clear context as needed.

## Top-level rules (reference for any future work in this app)

- **Always commit-clean before clearing context.** No half-files in the working tree at clear-time.
- **Use port 3001** for studio. Start with `npx remotion studio --port 3001` from `apps/bol-remotion-demo/`.
- **Conventional commits, no scope** (the repo's commitlint scope-enum doesn't include any value that fits this app).
- **BOL palette only** for visual styling: Graphite `#353D50`, Orange `#F85E32`, Cyan `#7BEDF8`, Gray `#8B8586`, Light Gray `#EEEEEE`, White. Roboto via `@remotion/google-fonts`.
- **One scene per file**, in `src/scenes/`. Each scene is a `<VignetteFrame>`-wrapped component.
- **Always register in [src/scenes/index.ts](src/scenes/index.ts)** — the registry array drives Root.tsx so each scene becomes its own composition.
- **Render-verification matters**: don't claim "done" without seeing the scene at localhost:3001 OR producing a single-frame PNG via `npx remotion still`. WebGL scenes (LightLeak) need `--gl=angle` or the configured Chromium GL renderer in `remotion.config.ts`.

## Scene inventory

20 compositions registered. All standalone-previewable in studio. ✅ = verified via still render.

| #   | Scene file                                                    | Category             | Compositional API                                      | Status          |
| --- | ------------------------------------------------------------- | -------------------- | ------------------------------------------------------ | --------------- |
| 1   | [Title.tsx](src/scenes/Title.tsx)                             | Foundations          | `spring` × 3                                           | ✅              |
| 2   | [FrameRuler.tsx](src/scenes/FrameRuler.tsx)                   | Foundations          | `useCurrentFrame`, `useVideoConfig`                    | ✅              |
| 3   | [EasingZoo.tsx](src/scenes/EasingZoo.tsx)                     | Animation primitives | `interpolate({ easing })`, `Easing.*`                  | ✅              |
| 4   | [SpringTuning.tsx](src/scenes/SpringTuning.tsx)               | Animation primitives | `spring({ config })`                                   | ✅              |
| 5   | [SpringVsInterpolate.tsx](src/scenes/SpringVsInterpolate.tsx) | Animation primitives | `spring`, `interpolate`                                | ✅ pre-existing |
| 6   | [ColorInterpolation.tsx](src/scenes/ColorInterpolation.tsx)   | Animation primitives | `interpolateColors`                                    | ✅              |
| 7   | [SequenceLadder.tsx](src/scenes/SequenceLadder.tsx)           | Sequencing           | `<Sequence from={...}>`                                | ✅              |
| 8   | [SequencedText.tsx](src/scenes/SequencedText.tsx)             | Text                 | `spring` stagger                                       | ✅ pre-existing |
| 9   | [Typewriter.tsx](src/scenes/Typewriter.tsx)                   | Text                 | string slicing + cursor blink                          | ✅              |
| 10  | [HighlightPen.tsx](src/scenes/HighlightPen.tsx)               | Text                 | spring → `scaleX` wipe                                 | ✅              |
| 11  | [PathsAndShapes.tsx](src/scenes/PathsAndShapes.tsx)           | Visual effects       | `@remotion/paths`, `@remotion/shapes`                  | ✅ pre-existing |
| 12  | [LightLeaks.tsx](src/scenes/LightLeaks.tsx)                   | Visual effects       | `<LightLeak seed hueShift>`                            | ✅              |
| 13  | [BarChart.tsx](src/scenes/BarChart.tsx)                       | Charts               | `spring` + delay stagger                               | ✅              |
| 14  | [PieChart.tsx](src/scenes/PieChart.tsx)                       | Charts               | SVG `stroke-dasharray`                                 | ✅              |
| 15  | [LineChartMarker.tsx](src/scenes/LineChartMarker.tsx)         | Charts               | `evolvePath`, `getPointAtLength`, `getTangentAtLength` | ✅              |
| 16  | [AudioCaptions.tsx](src/scenes/AudioCaptions.tsx)             | Media                | `<Audio>`, `useAudioData`, `visualizeAudio`            | ✅ pre-existing |
| 17  | [LottieScene.tsx](src/scenes/LottieScene.tsx)                 | External             | `@remotion/lottie`, `delayRender`                      | ✅ pre-existing |
| 18  | [ThreeScene.tsx](src/scenes/ThreeScene.tsx)                   | 3D                   | `@remotion/three`, react-three-fiber                   | ✅ pre-existing |
| 19  | [TransitionGallery.tsx](src/scenes/TransitionGallery.tsx)     | Transitions          | fade/slide/wipe/flip/clockWipe                         | ✅              |
| 20  | [Outro.tsx](src/scenes/Outro.tsx)                             | Foundations          | `spring` × 3                                           | ✅ pre-existing |

Plus the master timeline:

| Composition | What                                                         | Status          |
| ----------- | ------------------------------------------------------------ | --------------- |
| `Showcase`  | Curated 7-vignette walkthrough wired with `TransitionSeries` | ✅ pre-existing |

## Verification stills

All in `out/stills/`. Visual verification per scene that's been rendered. Showcase is best verified by scrubbing in studio (since it includes audio).

| Scene              | Still                                                                                        |
| ------------------ | -------------------------------------------------------------------------------------------- |
| Title              | `out/stills/title.png`                                                                       |
| FrameRuler         | `out/stills/frame-ruler.png`                                                                 |
| EasingZoo          | `out/stills/easing-zoo.png`                                                                  |
| SpringTuning       | `out/stills/spring-tuning.png`                                                               |
| ColorInterpolation | `out/stills/color-interp.png`                                                                |
| SequenceLadder     | `out/stills/sequence-ladder.png`                                                             |
| Typewriter         | `out/stills/typewriter.png`                                                                  |
| HighlightPen       | `out/stills/highlight-pen.png`                                                               |
| LightLeaks         | `out/stills/light-leaks-30.png`, `out/stills/light-leaks-90.png`                             |
| BarChart           | `out/stills/bar-chart.png`                                                                   |
| PieChart           | `out/stills/pie-chart.png`                                                                   |
| LineChartMarker    | `out/stills/line-chart-marker.png` (mid-draw), `out/stills/line-chart-130.png` (with reveal) |
| TransitionGallery  | `out/stills/transition-gallery-72.png`                                                       |

## How a successor agent should resume

1. Read this file.
2. Read `IDEAS.md` for the full corpus of scene ideas + research notes.
3. Read `PRESENTATION.md` for the show-and-tell narrative.
4. Run `git status` — should be clean.
5. Open studio at http://localhost:3001 to scrub through any scene.
6. To add a new scene: create `scenes/<Name>.tsx`, register in `scenes/index.ts`, render-verify, commit.

## Known follow-ups (not done; left for Kelly's discretion)

- **Caption timing in [AudioCaptions.tsx:24](src/scenes/AudioCaptions.tsx)** — frame-by-frame tune against the actual VO audio.
- **Lottie content** — `public/lottie/animation.json` is a stranger's animation from LottieFiles. Replace with a BOL brand asset.
- **Final voiceover line** — current line is "Every frame, on brand. Every animation, generated from code." (ElevenLabs default voice). Easy to regenerate with a different line / voice.
- **Tier-3 scenes from IDEAS.md** that I skipped: `Series.Sequence`, `Loop/Freeze`, `MotionBlur`, `Confetti/particles`, `AudioWaveform` (smooth path version), `ZodSchema` parametrization. All would slot in as additional standalone scenes.

## Commit log (this session)

In order, latest first:

- `feat: add chart and transition gallery scenes` — BarChart, TransitionGallery, PieChart, LineChartMarker
- `feat: split title scene and add 8 new audition scenes` — Title refactor, scenes/index.ts registry, FrameRuler, EasingZoo, SpringTuning, ColorInterpolation, SequenceLadder, Typewriter, HighlightPen, LightLeaks, plus light-leaks dep + remotion.config.ts WebGL configuration

Pre-overnight (already on main from the earlier session):

- `feat: add BOL Remotion demo app`
- `chore: remove stale Claude worktree pointers and rescue artifacts`
