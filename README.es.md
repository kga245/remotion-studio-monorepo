[English](./README.md) | [日本語](./README.ja.md) | [简体中文](./README.zh-CN.md) | [한국어](./README.ko.md) | Español | [Français](./README.fr.md)

# Remotion Studio Monorepo

![Remotion Studio Monorepo](./docs/images/hero.jpg)

Un monorepo **solo de plantillas** para crear proyectos de video con **Remotion + React**. Crea nuevas apps desde `apps/_template` y desarróllalas de forma independiente.

## Inicio rápido

```bash
# Clonar e instalar
git clone git@github.com:Takamasa045/remotion-studio-monorepo.git
cd remotion-studio-monorepo && pnpm install

# Crear un nuevo proyecto
pnpm create:project

# Abrir el panel Forge Studio (Web)
pnpm forge studio

# Iniciar desarrollo
cd apps/<name> && pnpm dev
```

**Plantilla 3D:**

```bash
pnpm create:project -- -t 3d
```

## Prueba en 3 minutos

```bash
# 1) Abre forge (panel Web)
pnpm forge studio

# 2) Crea un nuevo proyecto
pnpm create:project

# 3) Inicia el desarrollo
cd apps/<name> && pnpm dev

# 4) Renderiza cuando esté listo
pnpm forge render --app <name> --composition <id>
```

Cuando `render` termina correctamente, se abre una página de celebración en el navegador (confetti + fireworks + achievement).

## Comandos Forge

| Comando                                             | Qué hace                                                 |
| --------------------------------------------------- | -------------------------------------------------------- |
| `pnpm forge studio`                                 | Inicia el panel Studio de Next.js (tarjetas de proyecto) |
| `pnpm forge render --app <name> --composition <id>` | Renderiza directamente una app específica                |
| `pnpm create:project`                               | Crea un nuevo proyecto (`app.meta.json` + thumbnail)     |
| `pnpm create:project -- -t 3d`                      | Crea un nuevo proyecto desde la plantilla 3D             |

## Qué puedes gestionar en la UI

- Tarjetas enfocadas: Cada tarjeta destaca una acción principal, como ver el último render, abrir dev o crear el primer render.
- Panel de control: Las acciones pesadas se agrupan en un panel lateral dedicado para `Renders / Dev / Meta`, manteniendo la cuadrícula fácil de revisar.
- Guía inicial: Una guía breve y descartable explica cómo ver renders, abrir el panel de control e iniciar el primer render.
- Selector de idioma: Cambia la UI de Studio entre japonés e inglés desde el encabezado.
- Filtros etiquetados: Búsqueda, categoría, estado y orden ayudan a encontrar rápidamente lo importante.

El objetivo es simple: mantener la gestión diaria de proyectos dentro del panel antes de bajar a las herramientas de terminal.

## Flujo recomendado

1. Abre `pnpm forge studio` y elige qué construir.
2. Ejecuta `pnpm create:project` para añadir una nueva obra.
3. Usa la acción principal de cada tarjeta para dar el siguiente paso.
4. Abre el panel de control cuando necesites renders, controles de dev o edición de metadatos.
5. Usa `cd apps/<name> && pnpm dev` o `pnpm forge render --app <name> --composition <id>` cuando prefieras iterar desde terminal.
6. Disfruta la pantalla de celebración y crea la siguiente pieza.

## Requisitos previos

- **Node.js** 22.17.0
- **pnpm** 10+
- **ffmpeg** (necesario para renderizar)

<details>
<summary>Guía de instalación</summary>

```bash
# Comprobar versiones
node -v && pnpm -v && ffmpeg -version

# Instalar ffmpeg
# macOS: brew install ffmpeg
# Windows: choco install ffmpeg
# Linux: apt/yum install ffmpeg
```

</details>

## Características

- **Monorepo** con pnpm workspaces
- **Gestión centralizada de dependencias** mediante **pnpm Catalog**
- **Plantillas** para proyectos 2D y 3D (`apps/_template`, `apps/3D-template`)
- **Ejemplo HTML-in-canvas** para Remotion 4.0.455+ (`apps/examples/html-in-canvas`)
- **Panel Forge Studio** (`pnpm forge studio`) para gestionar proyectos
- **Scripts de productividad** (scaffolding, helper de render, automatización de upgrades)
- **Referencia offline** (`docs/remotion-reference.md`)
- Utilidades de timeline, puente Anime.js, transiciones, R3F, Pixi/Konva y efectos WebGL
- Workflows **CI/CD** opcionales

---

## Gestión de dependencias (pnpm Catalog)

Este monorepo usa **pnpm Catalog** para gestionar de forma centralizada las versiones de React, Remotion, TypeScript y otras dependencias comunes.

### Cómo funciona

1. **Definiciones de versión** en `pnpm-workspace.yaml`:

   ```yaml
   catalog:
     react: ^18.3.1
     react-dom: ^18.3.1
     remotion: 4.0.x
     typescript: ^5.6.3
     # ... all @remotion/* packages
   ```

2. **Referencia en `package.json`**:

   ```json
   {
     "dependencies": {
       "react": "catalog:",
       "react-dom": "catalog:",
       "remotion": "catalog:"
     }
   }
   ```

3. **Actualizar versiones en un solo lugar**: Edita el catalog en `pnpm-workspace.yaml` y ejecuta:
   ```bash
   pnpm install
   ```

### Beneficios

- **Fuente única de verdad**: Todos los paquetes usan la misma versión en el monorepo.
- **Actualizaciones fáciles**: Cambia la versión una vez en el catalog y actualiza todo con `pnpm install`.
- **Consistencia**: Evita diferencias de versión entre apps.
- **Seguridad de tipos**: TypeScript y React se mantienen alineados.

---

## Estructura

```
remotion-studio-monorepo/
├── apps/
│   ├── studio/             # Panel Forge Studio (Next.js)
│   ├── _template/          # Plantilla base
│   └── 3D-template/        # Plantilla Three.js
├── packages/               # Paquetes compartidos opcionales
├── scripts/                # Herramientas CLI
└── docs/                   # Documentación
```

## Documentación

| Guía                                                      | Descripción                             |
| --------------------------------------------------------- | --------------------------------------- |
| [Structure](./docs/structure.md)                          | Arquitectura del monorepo               |
| [Adding Dependencies](./docs/adding-deps.md)              | Cómo añadir paquetes                    |
| [Assets Guide](./docs/assets.md)                          | Gestión de assets                       |
| [HTML-in-canvas](./docs/html-in-canvas.md)                | Configuración de canvas post-processing |
| [3D Notes](./docs/3d-notes.md)                            | Configuración de Three.js / R3F         |
| [AI Skill Playbook](./docs/ai/remotion-skill-playbook.md) | Flujo de trabajo Skill-first            |
| [Upgrading](./docs/upgrading-remotion.md)                 | Gestión de versiones de Remotion        |
| [Packages](./docs/packages.md)                            | Paquetes y librerías disponibles        |
| [Troubleshooting](./docs/troubleshooting.md)              | Problemas comunes y soluciones          |

> Los cambios asistidos por IA deberían seguir el flujo **Skill-first**. Usa MCP solo cuando sea explícitamente necesario (`docs/mcp-setup.md`).
>
> Recomendado: Instala la skill `remotion-best-practices` en tu entorno Codex/agents para obtener guía específica de Remotion. Vive fuera de este repositorio, por lo que clonar este repo no la instala.
>
> Configuración sugerida:
>
> ```bash
> # Instalar skills desde remotion-dev/skills
> npx skills install remotion-dev/skills
>
> # Luego usa: remotion-best-practices
>
> # Actualizar skills de Remotion instaladas más adelante
> pnpm skills:remotion:update
> ```

## Troubleshooting

**Command not found?** → Añade `@remotion/cli`: `pnpm -w add -D @remotion/cli`

**Submodule issues?** → `git submodule update --init --recursive`

**Más ayuda** → Consulta [docs/troubleshooting.md](./docs/troubleshooting.md)

## Licencia

MIT License — Este repo proporciona **solo plantillas**. Remotion se instala por separado mediante npm.

> **Nota:** Este es un proyecto **no oficial**, sin afiliación con Remotion.
