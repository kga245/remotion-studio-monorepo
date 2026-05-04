[English](./README.md) | [日本語](./README.ja.md) | 简体中文 | [한국어](./README.ko.md) | [Español](./README.es.md) | [Français](./README.fr.md)

# Remotion Studio Monorepo

![Remotion Studio Monorepo](./docs/images/hero.jpg)

这是一个用于通过 **Remotion + React** 构建视频项目的 **模板专用** monorepo。你可以从 `apps/_template` 创建新应用，并让每个项目独立开发。

## 快速开始

```bash
# 克隆并安装
git clone git@github.com:Takamasa045/remotion-studio-monorepo.git
cd remotion-studio-monorepo && pnpm install

# 创建新项目
pnpm create:project

# 打开 Forge Studio 仪表盘（Web）
pnpm forge studio

# 开始开发
cd apps/<name> && pnpm dev
```

**3D 模板:**

```bash
pnpm create:project -- -t 3d
```

## 3 分钟体验

```bash
# 1) 打开 forge（Web 仪表盘）
pnpm forge studio

# 2) 创建新作品
pnpm create:project

# 3) 开始开发
cd apps/<name> && pnpm dev

# 4) 准备好后渲染
pnpm forge render --app <name> --composition <id>
```

`render` 成功后，浏览器会打开庆祝页面（Confetti + fireworks + achievement）。

## Forge 命令速查

| 命令                                                | 作用                                            |
| --------------------------------------------------- | ----------------------------------------------- |
| `pnpm forge studio`                                 | 启动 Next.js Studio 仪表盘（项目卡片）          |
| `pnpm forge render --app <name> --composition <id>` | 直接渲染指定应用                                |
| `pnpm create:project`                               | 创建新项目（自动生成 `app.meta.json` 和缩略图） |
| `pnpm create:project -- -t 3d`                      | 使用 3D 模板创建新项目                          |

## UI 可管理的内容

- 聚焦项目卡片: 每张卡片突出一个主要操作，例如查看最新渲染、打开 dev 或创建首次渲染。
- 控制面板: `Renders / Dev / Meta` 等较重操作集中到专用侧边面板，让网格更容易浏览。
- 入门指南: 可关闭的短指南说明如何查看渲染、打开控制面板和启动首次渲染。
- 语言切换: 可在 Studio UI 头部切换日语和英语。
- 带标签的筛选: 搜索、分类、状态和排序控件让你更快找到重点项目。

目标很简单：尽量把日常项目管理留在仪表盘中完成，再按需回到终端工具。

## 推荐流程

1. 打开 `pnpm forge studio`，选择今天要制作的内容。
2. 运行 `pnpm create:project` 添加新作品。
3. 使用每张卡片上的主要操作进入下一步。
4. 需要渲染、dev 控制或元数据编辑时，打开控制面板。
5. 想用终端驱动迭代时，使用 `cd apps/<name> && pnpm dev` 或 `pnpm forge render --app <name> --composition <id>`。
6. 看完庆祝页面后，继续制作下一支作品。

## 前置条件

- **Node.js** 22.17.0
- **pnpm** 10+
- **ffmpeg**（渲染需要）

<details>
<summary>安装指南</summary>

```bash
# 检查版本
node -v && pnpm -v && ffmpeg -version

# 安装 ffmpeg
# macOS: brew install ffmpeg
# Windows: choco install ffmpeg
# Linux: apt/yum install ffmpeg
```

</details>

## 功能

- 基于 **pnpm workspaces** 的 monorepo
- 通过 **pnpm Catalog** 集中管理依赖版本
- **2D 与 3D 模板**（`apps/_template`, `apps/3D-template`）
- **HTML-in-canvas 示例**，适用于 Remotion 4.0.455+（`apps/examples/html-in-canvas`）
- 用于项目管理的 **Forge Studio 仪表盘**（`pnpm forge studio`）
- **生产力脚本**（项目脚手架、渲染辅助、升级自动化）
- **离线参考文档**（`docs/remotion-reference.md`）
- Timeline 工具、Anime.js bridge、transitions、R3F、Pixi/Konva、WebGL effects
- 可选 **CI/CD workflows**

---

## 依赖管理（pnpm Catalog）

本 monorepo 使用 **pnpm Catalog** 集中管理 React、Remotion、TypeScript 以及其他通用依赖的版本。

### 工作方式

1. 在 `pnpm-workspace.yaml` 中定义版本:

   ```yaml
   catalog:
     react: ^18.3.1
     react-dom: ^18.3.1
     remotion: 4.0.x
     typescript: ^5.6.3
     # ... all @remotion/* packages
   ```

2. 在 `package.json` 中引用:

   ```json
   {
     "dependencies": {
       "react": "catalog:",
       "react-dom": "catalog:",
       "remotion": "catalog:"
     }
   }
   ```

3. 在一个地方更新版本: 修改 `pnpm-workspace.yaml` 的 catalog，然后运行:
   ```bash
   pnpm install
   ```

### 优点

- **单一事实来源**: monorepo 内所有包使用同一套版本
- **更新简单**: 只改一次 catalog，再通过 `pnpm install` 更新整体
- **保持一致**: 避免应用之间出现版本不匹配
- **类型安全**: TypeScript 和 React 版本保持一致

---

## 目录结构

```
remotion-studio-monorepo/
├── apps/
│   ├── studio/             # Forge Studio 仪表盘（Next.js）
│   ├── _template/          # 基础模板
│   └── 3D-template/        # Three.js 模板
├── packages/               # 可选共享包
├── scripts/                # CLI 工具
└── docs/                   # 文档
```

## 文档

| 指南                                                      | 说明                        |
| --------------------------------------------------------- | --------------------------- |
| [Structure](./docs/structure.md)                          | Monorepo 架构               |
| [Adding Dependencies](./docs/adding-deps.md)              | 如何添加 packages           |
| [Assets Guide](./docs/assets.md)                          | 管理 assets                 |
| [HTML-in-canvas](./docs/html-in-canvas.md)                | Canvas post-processing 设置 |
| [3D Notes](./docs/3d-notes.md)                            | Three.js / R3F 设置         |
| [AI Skill Playbook](./docs/ai/remotion-skill-playbook.md) | Skill-first workflow        |
| [Upgrading](./docs/upgrading-remotion.md)                 | Remotion 版本管理           |
| [Packages](./docs/packages.md)                            | 可用 packages 与 libraries  |
| [Troubleshooting](./docs/troubleshooting.md)              | 常见问题与解决方案          |

> AI 辅助变更应遵循 **Skill-first** workflow。仅在明确需要时使用 MCP（`docs/mcp-setup.md`）。
>
> 推荐: 在 Codex/agents 环境中安装 `remotion-best-practices` skill，以获得 Remotion 专用指导。该 skill 位于本仓库之外，仅 clone 本仓库不会自动安装。
>
> 推荐设置:
>
> ```bash
> # 从 remotion-dev/skills 安装 skills
> npx skills install remotion-dev/skills
>
> # 然后使用: remotion-best-practices
>
> # 稍后更新已安装的 Remotion skills
> pnpm skills:remotion:update
> ```

## Troubleshooting

**Command not found?** → 添加 `@remotion/cli`: `pnpm -w add -D @remotion/cli`

**Submodule issues?** → `git submodule update --init --recursive`

**更多帮助** → 参见 [docs/troubleshooting.md](./docs/troubleshooting.md)

## License

MIT License — 本仓库仅提供 **templates**。Remotion 需通过 npm 单独安装。

> **Note:** 这是一个 **非官方** 项目，与 Remotion 没有关联。
