[EN](./README.md) | [JA](./README.ja.md)

# Remotion Studio Monorepo

![Remotion Studio Monorepo](./docs/images/hero.jpg)

A **template-only** monorepo for building video projects with **Remotion + React**. Create new apps from `apps/_template` and develop independently.

## Quick Start

```bash
# Clone & install
git clone git@github.com:Takamasa045/remotion-studio-monorepo.git
cd remotion-studio-monorepo && pnpm install

# Create new project
pnpm create:project

# Open Forge Studio dashboard (Web)
pnpm forge studio

# Start development
cd apps/<name> && pnpm dev
```

**3D Template:**

```bash
pnpm create:project -- -t 3d
```

## Start Playing in 3 Minutes

```bash
# 1) Open the forge (Web dashboard)
pnpm forge studio

# 2) Create a new project
pnpm create:project

# 3) Start development
cd apps/<name> && pnpm dev

# 4) Render when ready
pnpm forge render --app <name> --composition <id>
```

On successful `render`, a celebration page opens in your browser (Confetti + fireworks + achievement).

## Forge Command Cheat Sheet

| Command                                             | What it does                                                       |
| --------------------------------------------------- | ------------------------------------------------------------------ |
| `pnpm forge studio`                                 | Starts Next.js Studio dashboard (project cards)                    |
| `pnpm forge render --app <name> --composition <id>` | Renders a specific app directly                                    |
| `pnpm create:project`                               | Creates a new project (auto-generates `app.meta.json` + thumbnail) |
| `pnpm create:project -- -t 3d`                      | Creates a new project from 3D template                             |

## What You Can Manage in the UI

- Focused project cards: Each card now emphasizes one primary action such as watch latest, open dev, or create first render.
- Control panel: Heavy actions move into a dedicated side panel for `Renders / Dev / Meta`, keeping the grid easier to scan.
- Getting-started guide: A short dismissible guide explains how to watch renders, open the control panel, and start first renders.
- Language toggle: Switch the Studio UI between Japanese and English from the header.
- Labeled filters: Search, category, status, and sort controls now make it easier to find what matters quickly.

The goal is simple: keep most daily project management inside the dashboard before dropping to terminal tools.

## Recommended Loop

1. Open `pnpm forge studio` and choose what to build.
2. Run `pnpm create:project` to add a new work.
3. Use the primary action on each card for the next obvious step.
4. Open the control panel when you need renders, dev controls, or metadata editing.
5. Use `cd apps/<name> && pnpm dev` or `pnpm forge render --app <name> --composition <id>` when you want terminal-driven iteration.
6. Enjoy the celebration screen, then forge the next one.

## Prerequisites

- **Node.js** 22.17.0
- **pnpm** 10+
- **ffmpeg** (for rendering)

<details>
<summary>Installation guides</summary>

```bash
# Check versions
node -v && pnpm -v && ffmpeg -version

# Install ffmpeg
# macOS: brew install ffmpeg
# Windows: choco install ffmpeg
# Linux: apt/yum install ffmpeg
```

</details>

## Features

- **Monorepo** powered by pnpm workspaces
- **Centralized dependency management** via **pnpm Catalog**
- **Templates** for 2D & 3D projects (`apps/_template`, `apps/3D-template`)
- **Forge Studio dashboard** (`pnpm forge studio`) for project management
- **Productivity scripts** (project scaffolding, render helper, upgrade automation)
- **Offline reference** (`docs/remotion-reference.md`)
- **Timeline utilities** (`@studio/timing`), **Anime.js bridge**, transitions, R3F, Pixi/Konva, WebGL effects
- Optional **CI/CD workflows**

---

## Dependency Management (pnpm Catalog)

This monorepo uses **pnpm Catalog** to centrally manage versions of React, Remotion, TypeScript, and other common dependencies.

### How it works

1. **Version definitions** in `pnpm-workspace.yaml`:

   ```yaml
   catalog:
     react: ^18.3.1
     react-dom: ^18.3.1
     remotion: 4.0.x
     typescript: ^5.6.3
     # ... all @remotion/* packages
   ```

2. **Reference in `package.json`**:

   ```json
   {
     "dependencies": {
       "react": "catalog:",
       "react-dom": "catalog:",
       "remotion": "catalog:"
     }
   }
   ```

3. **Update versions in one place**: Edit `pnpm-workspace.yaml` catalog, then run:
   ```bash
   pnpm install
   ```

### Benefits

- **Single source of truth**: All packages use the same version across the monorepo
- **Easy updates**: Change version once in catalog, update everywhere with `pnpm install`
- **Consistency**: Prevents version mismatches between apps
- **Type safety**: TypeScript and React versions stay aligned

---

## Structure

```
remotion-studio-monorepo/
├── apps/
│   ├── studio/             # Forge Studio dashboard (Next.js)
│   ├── _template/          # Base template
│   └── 3D-template/        # Three.js template
├── packages/               # (Optional shared packages)
├── scripts/                # CLI tools
└── docs/                   # Documentation
```

## Documentation

| Guide                                                     | Description                    |
| --------------------------------------------------------- | ------------------------------ |
| [Structure](./docs/structure.md)                          | Monorepo architecture          |
| [Adding Dependencies](./docs/adding-deps.md)              | How to add packages            |
| [Assets Guide](./docs/assets.md)                          | Managing assets                |
| [3D Notes](./docs/3d-notes.md)                            | Three.js / R3F setup           |
| [AI Skill Playbook](./docs/ai/remotion-skill-playbook.md) | Skill-first workflow           |
| [Upgrading](./docs/upgrading-remotion.md)                 | Remotion version management    |
| [Packages](./docs/packages.md)                            | Available packages & libraries |
| [Troubleshooting](./docs/troubleshooting.md)              | Common issues & solutions      |

> AI-assisted changes should follow the **Skill-first** workflow. Use MCP only when explicitly needed (`docs/mcp-setup.md`).
>
> Recommended: Install the `remotion-best-practices` skill in your Codex/agents environment for Remotion-specific guidance. It lives outside this repository, so cloning this repo alone does not install it.
>
> Suggested setup:
>
> ```bash
> # Install skills from remotion-dev/skills
> npx skills install remotion-dev/skills
>
> # Then use: remotion-best-practices
>
> # Update installed Remotion skills later
> pnpm skills:remotion:update
> ```

## Troubleshooting

**Command not found?** → Add `@remotion/cli`: `pnpm -w add -D @remotion/cli`

**Submodule issues?** → `git submodule update --init --recursive`

**More help** → See [docs/troubleshooting.md](./docs/troubleshooting.md)

## License

MIT License — This repo provides **templates only**. Remotion is installed separately via npm.

> **Note:** This is an **unofficial** project, not affiliated with Remotion.
