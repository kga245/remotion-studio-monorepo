[English](./README.md) | [日本語](./README.ja.md) | [简体中文](./README.zh-CN.md) | 한국어 | [Español](./README.es.md) | [Français](./README.fr.md)

# Remotion Studio Monorepo

![Remotion Studio Monorepo](./docs/images/hero.jpg)

**Remotion + React** 로 영상 프로젝트를 만들기 위한 **템플릿 전용** monorepo입니다. `apps/_template`에서 새 앱을 만들고, 각 프로젝트를 독립적으로 개발할 수 있습니다.

## Quick Start

```bash
# Clone & install
git clone git@github.com:Takamasa045/remotion-studio-monorepo.git
cd remotion-studio-monorepo && pnpm install

# 새 프로젝트 생성
pnpm create:project

# Forge Studio 대시보드 열기 (Web)
pnpm forge studio

# 개발 시작
cd apps/<name> && pnpm dev
```

**3D Template:**

```bash
pnpm create:project -- -t 3d
```

## 3분 안에 체험하기

```bash
# 1) forge 열기 (Web dashboard)
pnpm forge studio

# 2) 새 프로젝트 생성
pnpm create:project

# 3) 개발 시작
cd apps/<name> && pnpm dev

# 4) 준비되면 렌더링
pnpm forge render --app <name> --composition <id>
```

`render`가 성공하면 브라우저에서 축하 페이지가 열립니다 (Confetti + fireworks + achievement).

## Forge Command Cheat Sheet

| Command                                             | 설명                                                           |
| --------------------------------------------------- | -------------------------------------------------------------- |
| `pnpm forge studio`                                 | Next.js Studio 대시보드를 시작합니다 (project cards)           |
| `pnpm forge render --app <name> --composition <id>` | 특정 앱을 직접 렌더링합니다                                    |
| `pnpm create:project`                               | 새 프로젝트를 만듭니다 (`app.meta.json` + thumbnail 자동 생성) |
| `pnpm create:project -- -t 3d`                      | 3D template에서 새 프로젝트를 만듭니다                         |

## UI에서 관리할 수 있는 것

- 집중형 프로젝트 카드: 각 카드는 최신 렌더 보기, dev 열기, 첫 렌더 만들기처럼 하나의 주요 액션을 강조합니다.
- Control panel: `Renders / Dev / Meta` 같은 무거운 작업은 전용 side panel로 옮겨 grid를 더 쉽게 훑을 수 있게 합니다.
- Getting-started guide: 렌더 보기, control panel 열기, 첫 렌더 시작을 짧게 안내하며 닫을 수 있습니다.
- Language toggle: Studio UI header에서 Japanese / English를 전환할 수 있습니다.
- Labeled filters: 검색, category, status, sort controls로 필요한 프로젝트를 빠르게 찾을 수 있습니다.

목표는 단순합니다. 대부분의 일상적인 프로젝트 관리를 dashboard 안에서 끝내고, 필요할 때만 terminal tools로 내려가는 것입니다.

## Recommended Loop

1. `pnpm forge studio`를 열고 무엇을 만들지 선택합니다.
2. `pnpm create:project`로 새 작업을 추가합니다.
3. 각 카드의 primary action으로 다음 단계로 이동합니다.
4. renders, dev controls, metadata editing이 필요하면 control panel을 엽니다.
5. terminal 중심으로 반복하고 싶을 때는 `cd apps/<name> && pnpm dev` 또는 `pnpm forge render --app <name> --composition <id>`를 사용합니다.
6. 축하 화면을 본 뒤 다음 작품을 만듭니다.

## Prerequisites

- **Node.js** 22.17.0
- **pnpm** 10+
- **ffmpeg** (rendering에 필요)

<details>
<summary>Installation guides</summary>

```bash
# 버전 확인
node -v && pnpm -v && ffmpeg -version

# ffmpeg 설치
# macOS: brew install ffmpeg
# Windows: choco install ffmpeg
# Linux: apt/yum install ffmpeg
```

</details>

## Features

- **pnpm workspaces** 기반 monorepo
- **pnpm Catalog** 를 통한 중앙 집중식 dependency management
- **2D & 3D templates** (`apps/_template`, `apps/3D-template`)
- Remotion 4.0.455+용 **HTML-in-canvas example** (`apps/examples/html-in-canvas`)
- Project management를 위한 **Forge Studio dashboard** (`pnpm forge studio`)
- **Productivity scripts** (project scaffolding, render helper, upgrade automation)
- **Offline reference** (`docs/remotion-reference.md`)
- Timeline utilities, Anime.js bridge, transitions, R3F, Pixi/Konva, WebGL effects
- Optional **CI/CD workflows**

---

## Dependency Management (pnpm Catalog)

이 monorepo는 **pnpm Catalog** 를 사용해 React, Remotion, TypeScript 및 공통 dependencies의 버전을 중앙에서 관리합니다.

### 동작 방식

1. `pnpm-workspace.yaml`에 version 정의:

   ```yaml
   catalog:
     react: ^18.3.1
     react-dom: ^18.3.1
     remotion: 4.0.x
     typescript: ^5.6.3
     # ... all @remotion/* packages
   ```

2. `package.json`에서 참조:

   ```json
   {
     "dependencies": {
       "react": "catalog:",
       "react-dom": "catalog:",
       "remotion": "catalog:"
     }
   }
   ```

3. 한 곳에서 version 업데이트: `pnpm-workspace.yaml`의 catalog를 수정한 뒤 실행합니다:
   ```bash
   pnpm install
   ```

### Benefits

- **Single source of truth**: monorepo 전체가 같은 version을 사용합니다.
- **Easy updates**: catalog에서 한 번 바꾸고 `pnpm install`로 전체를 갱신합니다.
- **Consistency**: 앱 사이의 version mismatch를 방지합니다.
- **Type safety**: TypeScript와 React version이 맞춰진 상태를 유지합니다.

---

## Structure

```
remotion-studio-monorepo/
├── apps/
│   ├── studio/             # Forge Studio dashboard (Next.js)
│   ├── _template/          # Base template
│   └── 3D-template/        # Three.js template
├── packages/               # Optional shared packages
├── scripts/                # CLI tools
└── docs/                   # Documentation
```

## Documentation

| Guide                                                     | Description                    |
| --------------------------------------------------------- | ------------------------------ |
| [Structure](./docs/structure.md)                          | Monorepo architecture          |
| [Adding Dependencies](./docs/adding-deps.md)              | How to add packages            |
| [Assets Guide](./docs/assets.md)                          | Managing assets                |
| [HTML-in-canvas](./docs/html-in-canvas.md)                | Canvas post-processing setup   |
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

**Command not found?** → `@remotion/cli` 추가: `pnpm -w add -D @remotion/cli`

**Submodule issues?** → `git submodule update --init --recursive`

**More help** → [docs/troubleshooting.md](./docs/troubleshooting.md) 참고

## License

MIT License — 이 repo는 **templates only**를 제공합니다. Remotion은 npm을 통해 별도로 설치됩니다.

> **Note:** 이 프로젝트는 Remotion과 제휴하지 않은 **unofficial** project입니다.
