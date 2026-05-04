[English](./README.md) | [日本語](./README.ja.md) | [简体中文](./README.zh-CN.md) | [한국어](./README.ko.md) | [Español](./README.es.md) | Français

# Remotion Studio Monorepo

![Remotion Studio Monorepo](./docs/images/hero.jpg)

Un monorepo **réservé aux templates** pour créer des projets vidéo avec **Remotion + React**. Créez de nouvelles apps depuis `apps/_template` et développez-les indépendamment.

## Démarrage rapide

```bash
# Cloner et installer
git clone git@github.com:Takamasa045/remotion-studio-monorepo.git
cd remotion-studio-monorepo && pnpm install

# Créer un nouveau projet
pnpm create:project

# Ouvrir le tableau de bord Forge Studio (Web)
pnpm forge studio

# Démarrer le développement
cd apps/<name> && pnpm dev
```

**Template 3D :**

```bash
pnpm create:project -- -t 3d
```

## Essayer en 3 minutes

```bash
# 1) Ouvrir forge (tableau de bord Web)
pnpm forge studio

# 2) Créer un nouveau projet
pnpm create:project

# 3) Démarrer le développement
cd apps/<name> && pnpm dev

# 4) Rendre quand tout est prêt
pnpm forge render --app <name> --composition <id>
```

Quand `render` réussit, une page de célébration s'ouvre dans le navigateur (confetti + fireworks + achievement).

## Aide-mémoire Forge

| Commande                                            | Action                                                       |
| --------------------------------------------------- | ------------------------------------------------------------ |
| `pnpm forge studio`                                 | Lance le tableau de bord Studio Next.js (cartes de projet)   |
| `pnpm forge render --app <name> --composition <id>` | Rend directement une app précise                             |
| `pnpm create:project`                               | Crée un nouveau projet (`app.meta.json` + thumbnail générés) |
| `pnpm create:project -- -t 3d`                      | Crée un nouveau projet depuis le template 3D                 |

## Ce que vous pouvez gérer dans l'UI

- Cartes de projet ciblées : Chaque carte met en avant une action principale, comme voir le dernier rendu, ouvrir dev ou créer le premier rendu.
- Panneau de contrôle : Les actions lourdes sont regroupées dans un panneau latéral dédié à `Renders / Dev / Meta`, pour garder la grille facile à parcourir.
- Guide de démarrage : Un court guide masquable explique comment voir les rendus, ouvrir le panneau de contrôle et lancer un premier rendu.
- Sélecteur de langue : Basculez l'UI Studio entre japonais et anglais depuis l'en-tête.
- Filtres libellés : Recherche, catégorie, statut et tri permettent de trouver rapidement ce qui compte.

L'objectif est simple : garder la gestion quotidienne des projets dans le tableau de bord avant de revenir aux outils de terminal.

## Boucle recommandée

1. Ouvrez `pnpm forge studio` et choisissez ce que vous voulez créer.
2. Lancez `pnpm create:project` pour ajouter une nouvelle œuvre.
3. Utilisez l'action principale de chaque carte pour passer à l'étape suivante.
4. Ouvrez le panneau de contrôle quand vous avez besoin des rendus, des contrôles dev ou de l'édition des métadonnées.
5. Utilisez `cd apps/<name> && pnpm dev` ou `pnpm forge render --app <name> --composition <id>` quand vous voulez itérer depuis le terminal.
6. Profitez de l'écran de célébration, puis créez la pièce suivante.

## Prérequis

- **Node.js** 22.17.0
- **pnpm** 10+
- **ffmpeg** (nécessaire pour le rendu)

<details>
<summary>Guides d'installation</summary>

```bash
# Vérifier les versions
node -v && pnpm -v && ffmpeg -version

# Installer ffmpeg
# macOS: brew install ffmpeg
# Windows: choco install ffmpeg
# Linux: apt/yum install ffmpeg
```

</details>

## Fonctionnalités

- **Monorepo** basé sur pnpm workspaces
- **Gestion centralisée des dépendances** via **pnpm Catalog**
- **Templates** pour projets 2D et 3D (`apps/_template`, `apps/3D-template`)
- **Exemple HTML-in-canvas** pour Remotion 4.0.455+ (`apps/examples/html-in-canvas`)
- **Tableau de bord Forge Studio** (`pnpm forge studio`) pour gérer les projets
- **Scripts de productivité** (scaffolding, assistant de rendu, automatisation des mises à niveau)
- **Référence hors ligne** (`docs/remotion-reference.md`)
- Utilitaires de timeline, bridge Anime.js, transitions, R3F, Pixi/Konva et effets WebGL
- Workflows **CI/CD** optionnels

---

## Gestion des dépendances (pnpm Catalog)

Ce monorepo utilise **pnpm Catalog** pour gérer de façon centralisée les versions de React, Remotion, TypeScript et d'autres dépendances communes.

### Fonctionnement

1. **Définitions de versions** dans `pnpm-workspace.yaml` :

   ```yaml
   catalog:
     react: ^18.3.1
     react-dom: ^18.3.1
     remotion: 4.0.x
     typescript: ^5.6.3
     # ... all @remotion/* packages
   ```

2. **Référence dans `package.json`** :

   ```json
   {
     "dependencies": {
       "react": "catalog:",
       "react-dom": "catalog:",
       "remotion": "catalog:"
     }
   }
   ```

3. **Mettre à jour les versions au même endroit** : Modifiez le catalog dans `pnpm-workspace.yaml`, puis lancez :
   ```bash
   pnpm install
   ```

### Avantages

- **Source unique de vérité** : Tous les packages utilisent la même version dans le monorepo.
- **Mises à jour simples** : Changez la version une fois dans le catalog, puis mettez tout à jour avec `pnpm install`.
- **Cohérence** : Évite les écarts de version entre les apps.
- **Sécurité de typage** : Les versions de TypeScript et React restent alignées.

---

## Structure

```
remotion-studio-monorepo/
├── apps/
│   ├── studio/             # Tableau de bord Forge Studio (Next.js)
│   ├── _template/          # Template de base
│   └── 3D-template/        # Template Three.js
├── packages/               # Packages partagés optionnels
├── scripts/                # Outils CLI
└── docs/                   # Documentation
```

## Documentation

| Guide                                                     | Description                             |
| --------------------------------------------------------- | --------------------------------------- |
| [Structure](./docs/structure.md)                          | Architecture du monorepo                |
| [Adding Dependencies](./docs/adding-deps.md)              | Comment ajouter des packages            |
| [Assets Guide](./docs/assets.md)                          | Gestion des assets                      |
| [HTML-in-canvas](./docs/html-in-canvas.md)                | Configuration du canvas post-processing |
| [3D Notes](./docs/3d-notes.md)                            | Configuration Three.js / R3F            |
| [AI Skill Playbook](./docs/ai/remotion-skill-playbook.md) | Workflow Skill-first                    |
| [Upgrading](./docs/upgrading-remotion.md)                 | Gestion des versions de Remotion        |
| [Packages](./docs/packages.md)                            | Packages et bibliothèques disponibles   |
| [Troubleshooting](./docs/troubleshooting.md)              | Problèmes courants et solutions         |

> Les changements assistés par IA devraient suivre le workflow **Skill-first**. Utilisez MCP seulement quand c'est explicitement nécessaire (`docs/mcp-setup.md`).
>
> Recommandé : Installez la skill `remotion-best-practices` dans votre environnement Codex/agents pour obtenir des conseils spécifiques à Remotion. Elle vit hors de ce dépôt, donc cloner ce repo ne l'installe pas.
>
> Configuration suggérée :
>
> ```bash
> # Installer les skills depuis remotion-dev/skills
> npx skills install remotion-dev/skills
>
> # Puis utiliser : remotion-best-practices
>
> # Mettre à jour plus tard les skills Remotion installées
> pnpm skills:remotion:update
> ```

## Troubleshooting

**Command not found?** → Ajoutez `@remotion/cli` : `pnpm -w add -D @remotion/cli`

**Submodule issues?** → `git submodule update --init --recursive`

**Plus d'aide** → Voir [docs/troubleshooting.md](./docs/troubleshooting.md)

## Licence

MIT License — Ce repo fournit **uniquement des templates**. Remotion est installé séparément via npm.

> **Note :** Ceci est un projet **non officiel**, non affilié à Remotion.
