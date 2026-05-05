# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A pnpm + Turborepo monorepo of independent **Remotion** (React-driven video) apps that share a brand kit and a small library of timing/animation utilities. Each `apps/<name>/` is its own self-contained Remotion project with its own deps, its own studio, and its own renders. Shared code lives in `packages/@studio/*`.

There are **two unrelated "studios"** in this repo and they get confused constantly:

- `apps/studio/` is a **Next.js dashboard** ("Forge Studio") that lists all the Remotion projects as cards. Started via `pnpm forge studio`. Runs on port 3000 by default.
- Each individual Remotion project's `pnpm dev` runs **Remotion Studio** (the framework's preview/timeline tool). Also defaults to port 3000 — pass `--port 3001` if both are running.

## Common commands

From repo root:

```bash
pnpm install                                # install workspace deps
pnpm create:project [name]                  # scaffold new app from apps/_template
pnpm create:project -- -t 3d                # scaffold from apps/3D-template
pnpm forge studio                           # launch the Next.js project-card dashboard
pnpm forge render --app <name> --composition <id>   # headless render orchestrator
pnpm test                                   # vitest run (root config)
pnpm test:watch
pnpm typecheck                              # turbo typecheck across workspaces
pnpm lint                                   # turbo lint across workspaces
pnpm format / pnpm format:check             # prettier
pnpm clean                                  # turbo clean + scripts/clean.ts
pnpm upgrade:remotion / pnpm upgrade:remotion:dry
```

Inside an individual app (`apps/<name>/`):

```bash
pnpm dev                                    # remotion studio
pnpm dev -- --port 3001                     # if root studio is already on 3000
pnpm build                                  # remotion render (script in package.json)
npx remotion still src/index.ts <CompId> out/<file>.png --frame N    # single-frame render for verification
npx remotion render src/index.ts <CompId> out/<file>.mp4 --props='{...}'   # headless MP4 with props
```

To run a single test file: `pnpm test path/to/file.test.ts` (vitest config at repo root).

## Critical conventions

### pnpm Catalog is the single source of truth for Remotion versions

`pnpm-workspace.yaml` defines the catalog — every `@remotion/*`, `react`, `react-dom`, `typescript`, etc. version lives there. Apps reference catalog entries via `"react": "catalog:"` in their `package.json`. **Never pin Remotion versions directly in an app's `package.json`** — it breaks the version-alignment guarantee and causes drift across apps.

To bump Remotion across the whole repo: edit `pnpm-workspace.yaml`, run `pnpm install`. Use `pnpm upgrade:remotion` for the orchestrated path.

### Commitlint with restricted scopes

Hooks reject any commit that doesn't follow Conventional Commits, configured in [commitlint.config.js](commitlint.config.js):

- **Types** must be one of: `feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert`.
- **Scopes**, when present, must be one of: `timing|hooks|types|easings|transitions|scripts|docs|ci|deps|examples`.

App-level commits (e.g. work inside `apps/bol-remotion-demo/`) **should use no scope** — there's no valid scope for individual apps in the enum. Don't try `feat(bol-remotion-demo): ...` — it will be rejected.

### lint-staged runs on commit

Pre-commit runs `eslint --fix` then `prettier --write` on staged `.ts/tsx/js/jsx` files, and `prettier --write` on `.json/md/yml/yaml`. **Files often arrive in the commit reformatted vs how you wrote them.** Don't fight prettier; let it run, then re-stage if needed.

### Workspace package imports

Apps import shared code via `@studio/*` (e.g. `import {frameToMs} from "@studio/timing"`). The webpack alias is set up in each app's [remotion.config.ts](apps/_template/remotion.config.ts) — it walks `packages/` and aliases each package's name to its `src/` directory. **No build step required** for shared packages; they're imported as TypeScript source.

### Per-app metadata

Each app has an [app.meta.json](apps/_template/app.meta.json) describing title/description/tags/category/thumbnail. The Forge Studio dashboard reads these to render its project-card grid. Run `pnpm create:project` to get one auto-generated.

## Architecture

### Top-level layout

```
apps/                # Self-contained Remotion projects (and the studio dashboard)
  studio/            # Next.js Forge Studio dashboard
  _template/         # 2D scaffold for `pnpm create:project`
  3D-template/       # 3D scaffold (Three.js)
  examples/          # Reference apps (animations-showcase, html-in-canvas)
  bol-remotion-demo/ # Active demo deck — see its own PRESENTATION.md / PROGRESS.md
  miter-llm-webinar/ # Client work (Miter LLM webinar overlays)
  pixel-typography/  # Typography experiments
packages/@studio/    # Shared workspace packages (imported as source)
  core-types/        # Shared TS types
  timing/            # Frame/time helpers (frameToMs, secondsToFrames)
  hooks/             # Remotion-oriented React hooks (useFrameProgress, etc.)
  easings/           # Cubic-bezier helpers
  transitions/       # Reusable transition components
  kinetic-captions/  # SRT-driven word-by-word caption engine (used by miter-llm-webinar)
scripts/             # Repo-level CLI helpers (create-project.ts, render-app.ts, ...)
docs/                # Bilingual EN + JA documentation
```

### Inside a Remotion app

```
apps/<name>/
  src/
    Root.tsx         # Registers <Composition> entries; entry point for studio
    index.ts         # registerRoot(Root)
    project.config.ts   # width/height/fps/duration constants
    scenes/          # One file per scene (composition)
    components/      # Shared UI helpers within the app
    styles/theme.ts  # Brand tokens (colors, typography, spring presets)
  public/            # Static assets (audio, lottie, images) — load via staticFile()
  out/               # Rendered MP4s and stills (gitignored)
  package.json       # Per-app deps (use catalog: protocol)
  remotion.config.ts # Webpack alias + GL renderer config
  tsconfig.json      # Extends ../../tsconfig.base.json
```

## Known footguns

### `tsc --noEmit` fails across most apps (runtime is fine)

`tsconfig.base.json` sets `module: NodeNext`, which makes TypeScript require `.js` extensions on every relative import. Remotion's bundler (esbuild) doesn't care, so the studio works fine — but `tsc --noEmit` fails with `TS2835: Relative import paths need explicit file extensions...`.

**To fix in a specific app**, add to its `tsconfig.json`:

```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "Bundler"
  }
}
```

`apps/bol-remotion-demo/tsconfig.json` already has this. Other apps inherit the broken config.

### `eslint-plugin-react-hooks@4.6.2` crashes on ESLint 9

The plugin is incompatible with ESLint 9 and **throws** when it sees a `useMemo` or `useEffect` with a dep array. Workarounds: refactor away the hook, OR upgrade `eslint-plugin-react-hooks` to v5 at the workspace level (pending). When you hit `TypeError: context.getSource is not a function` from this plugin, that's the cause.

### WebGL scenes need `--gl=angle` for headless render

`@remotion/light-leaks`, `@remotion/three`, and any custom WebGL component will fail headless renders with `Failed to get WebGL context` unless either:

- The render is invoked with `--gl=angle`, or
- The app's `remotion.config.ts` calls `Config.setChromiumOpenGlRenderer("angle")`.

Studio preview is unaffected (the host browser provides GL).

### Agent worktrees are gitignored

`.gitignore` covers `.claude/worktrees/`, `.claire/worktrees/`, and `.superpowers/brainstorm/` — agent-tooling artifacts that should never be committed. If `git status` ever fails with `not a git repository: ...worktrees/<name>`, look for a `.git` _file_ (not directory) buried inside one of those paths and delete the embedded directory.

## The active demo app: `apps/bol-remotion-demo/`

This is the working surface for an upcoming BOL Agency staff demo of Remotion capabilities. Has its own internal documentation:

- [PRESENTATION.md](apps/bol-remotion-demo/PRESENTATION.md) — show-and-tell deck (the canonical narrative)
- [PROGRESS.md](apps/bol-remotion-demo/PROGRESS.md) — build log + scene inventory + resumption guide
- [IDEAS.md](apps/bol-remotion-demo/IDEAS.md) — scene ideas mined from `.agents/skills/remotion-best-practices/`
- [LIVE-DEMO-PROMPTS.md](apps/bol-remotion-demo/LIVE-DEMO-PROMPTS.md) — Claude prompts for the live demo

Conventions specific to this app:

- Studio runs on **port 3001** (`npx remotion studio --port 3001`) — port 3000 is reserved for `apps/studio/` (the Forge dashboard).
- Scenes are folder-grouped in the studio sidebar via `<Folder name="...">`. The grouping is defined in [src/scenes/index.ts](apps/bol-remotion-demo/src/scenes/index.ts) as a `sceneFolders[]` array. Folder names match `[a-zA-Z0-9-]` only (Remotion validates them — no spaces, no Unicode).
- An empty `Archive` folder at the bottom is a parking lot for retired scenes — move a scene's entry there to demote it from a capability folder without deleting the file.
- Brand tokens (colors, typography, springs) live in [src/styles/theme.ts](apps/bol-remotion-demo/src/styles/theme.ts). All scenes import from there. **Don't hard-code colors** — change them once in `theme.ts` and every scene re-skins.
- Lottie color override via [src/lib/recolorLottie.ts](apps/bol-remotion-demo/src/lib/recolorLottie.ts) — `recolorLottieToBrand(json, palette)` walks any Lottie JSON and remaps source colors to a brand palette by luminance band. Used by every `Lottie*` scene.
- Verification stills live in [docs/stills/](apps/bol-remotion-demo/docs/stills/) (committed) — `out/stills/` is gitignored.

When asked to add a new scene to this app:

1. Create `src/scenes/<Name>.tsx` (use `<VignetteFrame>` for the shared header).
2. Add the entry to the right folder in `src/scenes/index.ts`.
3. Render-verify with `npx remotion still src/index.ts <Name> out/stills/<file>.png --frame N`.
4. Commit with no scope (e.g. `feat: add ...`) — commitlint will reject `feat(bol-remotion-demo): ...`.
