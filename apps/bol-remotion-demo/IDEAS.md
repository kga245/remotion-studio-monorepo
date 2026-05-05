# Scene Ideas — Remotion Capability Audition

> Generated from `.agents/skills/remotion-best-practices/` (44 rule files), official Remotion docs, and existing apps in this repo. Each row is a candidate for the audition pool. Build them, then Kelly picks favorites tomorrow.

## Categorization

Twelve categories covering the breadth of Remotion. Aim for 2–3 scenes per category at most, prioritizing visual variety + capability variety.

---

### A. Foundations (frame, fps, AbsoluteFill)

| Scene                         | API surface                                 | Status                                                                                                                                   |
| ----------------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Title** (refactor existing) | `useCurrentFrame`, `spring`, `AbsoluteFill` | ✅ existing inline → split out                                                                                                           |
| **Frame ruler**               | `useCurrentFrame`, `useVideoConfig`         | ⬜ new — visualize the frame counter as a ticking horizontal ruler with second markers, demonstrates the heartbeat of every Remotion app |

### B. Animation primitives

| Scene                     | API surface                                               | Status                                                                                   |
| ------------------------- | --------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **Spring vs Interpolate** | `spring`, `interpolate`, `Easing.out(cubic)`              | ✅ existing                                                                              |
| **Easing zoo**            | `interpolate`, `Easing.linear/quad/sin/exp/circle/bezier` | ⬜ new — six dots racing along the same horizontal track with each easing curve labelled |
| **Spring physics tuning** | `spring({ damping, stiffness, mass })`                    | ⬜ new — same ball, four spring presets side by side: smooth / snappy / bouncy / heavy   |
| **Color interpolation**   | `interpolateColors`                                       | ⬜ new — a swatch tweens through the BOL palette with the hex value displayed            |

### C. Sequencing & timing

| Scene               | API surface                               | Status                                                                                                          |
| ------------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Sequence ladder** | `<Sequence from={...}>`, nested sequences | ⬜ new — five badges enter at staggered offsets via Sequence, with a timeline ruler showing each badge's `from` |
| **Series.Sequence** | `<Series>`, `Series.Sequence`             | ⬜ new — three cards play one-after-another, demonstrating how Series shortens the timing math                  |
| **Loop / Freeze**   | `<Loop>`, `<Freeze>`                      | ⬜ new — same animation looped 3x next to a frozen-at-frame-15 still                                            |

### D. Text / typography

| Scene                            | API surface                                                                               | Status                                                                             |
| -------------------------------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **Sequenced word reveal**        | `spring` stagger                                                                          | ✅ existing                                                                        |
| **Typewriter**                   | string slicing, `useCurrentFrame`, blinking cursor via `interpolate(frame % blinkFrames)` | ⬜ new — based on the skill's `text-animations-typewriter.tsx` asset, restyled BOL |
| **Highlight pen**                | per-word `<Highlight>` with `scaleX` spring on a pseudo-underline                         | ⬜ new — based on the `text-animations-word-highlight.tsx` asset, restyled BOL     |
| **Kinetic captions (segmented)** | `@remotion/captions`, SRT parsing                                                         | ⬜ stretch — only if time                                                          |

### E. Visual effects

| Scene                    | API surface                                         | Status                                                                                                                          |
| ------------------------ | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Paths and shapes**     | `@remotion/paths`, `@remotion/shapes`, `evolvePath` | ✅ existing                                                                                                                     |
| **Light leaks**          | `@remotion/light-leaks` `<LightLeak seed hueShift>` | ⬜ new — a graphite scene with a BOL-orange light leak sweeping across, used as both standalone and as TransitionSeries.Overlay |
| **Motion blur**          | `@remotion/motion-blur` `<Trail>` or `<MotionBlur>` | ⬜ new — a fast-moving shape with motion-blur trail vs without                                                                  |
| **Confetti / particles** | hand-rolled with seeded `random`                    | ⬜ new — parametric confetti burst from the center on a beat                                                                    |

### F. Path animation / data

| Scene                      | API surface                                            | Status                                                                                          |
| -------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| **Bar chart**              | `spring` stagger across data array, custom YAxis/XAxis | ⬜ new — based on `charts-bar-chart.tsx` asset, BOL palette, "BOL ad spend by month" or similar |
| **Line chart with marker** | `evolvePath`, `getPointAtLength`, `getTangentAtLength` | ⬜ new — animated line draws across, with arrow marker following the tip                        |
| **Pie chart**              | SVG `stroke-dasharray` segments rotating from -90deg   | ⬜ new — three-segment pie, BOL palette                                                         |

### G. Media

| Scene                                | API surface                                                             | Status                                                                 |
| ------------------------------------ | ----------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **Audio with frame-locked captions** | `<Audio>`, `useAudioData`, `visualizeAudio`                             | ✅ existing                                                            |
| **Audio waveform (smooth path)**     | `useWindowedAudioData`, `visualizeAudioWaveform`, `createSmoothSvgPath` | ⬜ new — oscilloscope-style line waveform vs the bar viz already shown |
| **Image gallery with parallax**      | `<Img>`, `staticFile`, `interpolate`                                    | ⬜ stretch — needs assets, skip if no time                             |

### H. 3D

| Scene                           | API surface                                              | Status      |
| ------------------------------- | -------------------------------------------------------- | ----------- |
| **Three torus knot (existing)** | `@remotion/three`, `<ThreeCanvas>`, react-three-fiber    | ✅ existing |
| **Three text extrusion**        | `<Text3D>` from drei (if available) or extruded geometry | ⬜ stretch  |

### I. Transitions

| Scene                            | API surface                                                       | Status                                                                                               |
| -------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Transition gallery**           | `TransitionSeries.Transition` with fade/slide/wipe/flip/clockWipe | ⬜ new — single composition that cycles through every transition presentation back-to-back, labelled |
| **Transition timing comparison** | `linearTiming` vs `springTiming`                                  | ⬜ stretch — only if time                                                                            |

### J. Parametrization

| Scene                      | API surface                                       | Status                                                                                                                        |
| -------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Zod-driven props panel** | `z.object`, `zColor`, `schema` on `<Composition>` | ⬜ new — a "data panel" scene with a `title` / `accent color` / `tagline` input, demonstrate the studio sidebar can edit live |

### K. External integrations

| Scene        | API surface                       | Status                                                      |
| ------------ | --------------------------------- | ----------------------------------------------------------- |
| **Lottie**   | `@remotion/lottie`, `delayRender` | ✅ existing                                                 |
| **GIF**      | `@remotion/gif` `<Gif>`           | ⬜ stretch — needs an asset                                 |
| **Tailwind** | `@remotion/tailwind-v4`           | ⬜ stretch — would require switching the app's CSS pipeline |

### L. Outro

| Scene            | API surface                                        | Status                        |
| ---------------- | -------------------------------------------------- | ----------------------------- |
| **Outro card**   | `spring`, brand layout                             | ✅ existing                   |
| **Credits roll** | `interpolate(frame, [0, total], [start_y, end_y])` | ⬜ stretch — fun but optional |

---

## Build priority for tonight

**Tier 1 (must hit, ~10 scenes):**

1. Title (refactor existing inline)
2. Frame ruler
3. Easing zoo
4. Spring physics tuning
5. Color interpolation
6. Sequence ladder
7. Typewriter
8. Highlight pen
9. Light leaks
10. Bar chart
11. Transition gallery

**Tier 2 (do if time):** 12. Series.Sequence 13. Pie chart 14. Line chart with marker 15. Confetti / particles 16. Audio waveform (smooth path) 17. Motion blur 18. Color picker / Zod schema demo

**Tier 3 (skip likely):** 19. Loop / Freeze 20. Image gallery, GIF, Tailwind, Three text — all need extra setup or assets
