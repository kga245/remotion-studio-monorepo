# Miter LLM Webinar — Remotion Project

## Purpose

Kinetic animation overlays for the Miter LLM/GEO webinar video, produced for **BOL Agency**. The project produces two types of compositions:

- **Animations** — 1920×1080, 30 fps full-screen motion graphics that accompany key stats and concepts from the webinar
- **Captions** — 1280×720, 30 fps segmented subtitle overlays driven by an SRT file

## How to Run

From the monorepo root:

```bash
npx remotion studio apps/miter-llm-webinar/src/index.ts
```

Or via the monorepo forge launcher (see root `package.json` scripts).

## Brand & Theme (`src/theme.ts`)

Font: **Roboto** (via `@remotion/google-fonts/Roboto`), weights 300 / 400 / 700 / 900.

```ts
COLORS = {
  orange: "#F85E32", // primary accent — stats, highlights, call-to-action
  cyan: "#7BEDF8", // secondary accent — emphasis text, bottom summaries
  teal: "#7BEDF8", // alias for cyan
  dark: "#07070f", // background
  graphite: "#353D50", // subtle grid lines, muted borders
};
```

`brand` is a `BrandConfig` from `@studio/kinetic-captions`, extending `bolBrand` with the loaded `fontFamily`. Used only by `SegmentedCaptions`.

## File Structure

```
apps/miter-llm-webinar/
  src/
    Root.tsx              — registers all compositions; source of truth for IDs & durations
    theme.ts              — COLORS, fontFamily, brand config
    index.ts              — registerRoot(RemotionRoot)
    index.css             — global CSS resets
    SegmentedCaptions.tsx — caption engine (SRT → pages → kinetic highlight)
    compositions/         — one file per animation composition
  public/
    captions.srt          — full webinar SRT transcript (must be present for captions to render)
```

> **Note:** `captions.srt` is loaded via Remotion's `staticFile()` at runtime. Place the SRT file at `apps/miter-llm-webinar/public/captions.srt`.

## Compositions

### Captions Folder — `Segment-01` … `Segment-45`

Auto-generated from a `SEGMENTS` array of `[startMs, endMs]` pairs in `Root.tsx`. 45 segments covering the full ~22:32 webinar at 1280×720. Each segment renders the SRT captions for that time window with word-level kinetic highlighting.

### Animations Folder — 1920×1080 @ 30fps

| ID                    | Duration   | Batch                 | Description                                     |
| --------------------- | ---------- | --------------------- | ----------------------------------------------- |
| `Stat85`              | 240f (8s)  | 1 — Stats & Metaphors | Giant "85%" stat with spring-bounce entrance    |
| `Studio54Bouncer`     | 210f (7s)  | 1                     | Studio 54 bouncer metaphor for LLM selectivity  |
| `ThreeBouncers`       | 270f (9s)  | 1                     | Three-up bouncer comparison                     |
| `CTRDrop59`           | 240f (8s)  | 1                     | CTR drop statistic (-59%)                       |
| `ZeroClick`           | 210f (7s)  | 1                     | Zero-click search trend visualization           |
| `Growth35`            | 210f (7s)  | 2 — Data & Frameworks | 35% growth data point                           |
| `LowesCase`           | 210f (7s)  | 2                     | Lowe's case study callout                       |
| `TrainingVsAgentic`   | 240f (8s)  | 2                     | Training data vs. agentic retrieval split       |
| `MultiChannel`        | 270f (9s)  | 2                     | Multi-channel presence framework                |
| `PassageVsPage`       | 210f (7s)  | 2                     | Passage-level vs. page-level retrieval          |
| `QueryFanOuts`        | 240f (8s)  | 3 — Deep Mechanics    | LLM query fan-out visualization                 |
| `CosineSimilarity`    | 270f (9s)  | 3                     | Cosine similarity explainer                     |
| `ContentPerLLM`       | 240f (8s)  | 3                     | Content strategy per LLM model                  |
| `CapstoneAtomization` | 240f (8s)  | 3                     | Content atomization concept                     |
| `MilgardAudit`        | 270f (9s)  | 3                     | Milgard audit example                           |
| `PGTAudit`            | 210f (7s)  | 4 — Impact & Decision | PGT audit example                               |
| `DarkFunnel`          | 270f (9s)  | 4                     | Dark funnel / invisible influence visualization |
| `KPIs`                | 180f (6s)  | 4                     | GEO KPI scorecard                               |
| `Tsunami`             | 240f (8s)  | 4                     | Tsunami metaphor for AI disruption              |
| `TwoChoices`          | 210f (7s)  | 4                     | Adapt vs. ignore decision frame                 |
| `BezosQuote`          | 240f (8s)  | 5 — Interstitials     | Jeff Bezos quote card                           |
| `LLMsAreRoom`         | 180f (6s)  | 5                     | "LLMs are the room" metaphor                    |
| `CantBribe`           | 180f (6s)  | 5                     | "You can't bribe an LLM" statement              |
| `AreSomebody`         | 210f (7s)  | 5                     | "Be somebody" authority concept                 |
| `ExistentialThreat`   | 180f (6s)  | 5                     | Existential threat framing                      |
| `FetchabilityTips`    | 270f (9s)  | 5                     | 3 tips: Fetchability (Barrier 01)               |
| `AuthorityTips`       | 300f (10s) | 5                     | Tips: Authority (Barrier 02)                    |
| `ExtractabilityTips`  | 270f (9s)  | 5                     | Tips: Extractability (Barrier 03)               |
| `GoodMarketing`       | 180f (6s)  | 5                     | "GEO is just good marketing" closer             |
| `TheSaysMITER`        | 210f (7s)  | 5                     | MITER brand close/CTA                           |

## Animation Conventions

### Layout

- All animations: `AbsoluteFill` root with `background: COLORS.dark`, `fontFamily`, `overflow: hidden`
- Padding for text-heavy layouts: `60px 120px`
- Content centered via flexbox `alignItems / justifyContent: center`

### Typography scale

| Role              | Size                               | Weight | Color                    |
| ----------------- | ---------------------------------- | ------ | ------------------------ |
| Giant stat number | 320px                              | 900    | `COLORS.orange`          |
| Stat percent sign | 160px                              | 900    | `#ffffff`                |
| Section title     | 40px                               | 900    | `#ffffff`                |
| Tip/card title    | 36px                               | 700    | `#ffffff`                |
| Body / subtitle   | 56px (standalone), 22–28px (cards) | 300    | `#ffffff` or `#ffffff77` |
| Label badge text  | 18px                               | 400    | `COLORS.orange`          |
| Italic summary    | 22px                               | 400    | `COLORS.cyan`            |

### Spring configs (common patterns)

```ts
// Heavy entrance bounce (stats, numbers)
{ damping: 12, stiffness: 180, mass: 1.2 }

// Standard entrance (cards, tips)
{ damping: 20, stiffness: 160 }

// Snappy secondary element
{ damping: 15, stiffness: 200 }
```

### Motion patterns

- **Slide up + fade**: `interpolate(frame, [startF, endF], [60, 0])` translateY + opacity — used for subtitle lines
- **Slide in from left**: `interpolate(progress, [0, 1], [-60, 0])` translateX — used for tip rows
- **Scale spring**: spring value directly as CSS `scale()` — used for stat numbers
- **Staggered reveal**: each element has its own `delay` offset fed into `spring({ frame: frame - delay })`
- **Accent line grow**: `interpolate(frame, [startF, endF], [0, targetWidth])` on a div width with `Easing.out(Easing.exp)`
- **Background flash**: brief orange overlay on slam frame, fades in ~12 frames

### Recurring decorative elements

- **Subtle grid**: `backgroundImage` with `COLORS.graphite22` 1px lines at 120px spacing
- **Orange→Cyan gradient accent bar**: `linear-gradient(90deg, COLORS.orange, COLORS.cyan)`, h=4px, borderRadius=2
- **Label badge**: `background: COLORS.orange22`, `border: 1px solid COLORS.orange`, borderRadius 4, padding `6px 16px`, uppercase, letterSpacing `0.2em`
- **Left border on tip rows**: `borderLeft: 3px solid COLORS.orange`, paddingLeft 28

### Caption system (`SegmentedCaptions`)

- Loaded from `staticFile("captions.srt")` via Remotion's async `useDelayRender`
- Words split via `splitToWords()`, grouped into display phrases via `groupIntoPhrases()` — both from `@studio/kinetic-captions`
- Active word: **bold** weight + animated underline (orange, grows left-to-right over 200ms)
- Inactive word: light weight, `brand.secondary` color fading to `brand.text`
- Page transition: fade-in over 10 frames, premounted 0.5s early for smooth cuts

## Key Dependencies

- `remotion` — core framework
- `@remotion/google-fonts/Roboto` — font loading
- `@remotion/captions` — `parseSrt`, `Caption` type
- `@studio/kinetic-captions` — `BrandConfig`, `bolBrand`, `splitToWords`, `groupIntoPhrases`, `Page`, `PageToken`
