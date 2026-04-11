# Releasing

This repository uses [Release Please](https://github.com/googleapis/release-please) to automate versioning and GitHub Releases.

## How it works

Release Please watches `main` for [Conventional Commits](https://www.conventionalcommits.org/) and maintains a **Release PR** that stages the next release.

```
feat/fix/perf commits land on main
            │
            ▼
  Release Please updates a "Release PR"
  (bumps package.json + appends CHANGELOG.md)
            │
            ▼
       Merge the Release PR
            │
            ▼
  Tag  v<version>  + GitHub Release created
```

No manual `npm version`, no manual tags, no manual release notes.

## Commit conventions

Use these prefixes so Release Please classifies changes correctly:

| Prefix                     | Triggers release? | Bump (pre-1.0) | Bump (post-1.0) | Changelog section        |
| -------------------------- | ----------------- | -------------- | --------------- | ------------------------ |
| `feat:`                    | ✅                | patch          | minor           | Features                 |
| `fix:`                     | ✅                | patch          | patch           | Bug Fixes                |
| `perf:`                    | ✅                | patch          | patch           | Performance Improvements |
| `refactor:`                | ✅                | patch          | patch           | Code Refactoring         |
| `docs:`                    | ✅                | patch          | patch           | Documentation            |
| `build:`                   | ✅                | patch          | patch           | Build System             |
| `ci:` / `test:` / `chore:` | ❌                | —              | —               | hidden                   |

> **Pre-1.0 semantics (current).** While the version is `0.x`, `feat:` bumps **patch** (not minor) — this is Release Please's conservative default and matches how `0.x` projects typically behave. Breaking changes bump **minor**. Once we reach `1.0.0`, standard semver kicks in automatically.

### Breaking changes

Append `!` to the type (`feat!:`) **or** add a `BREAKING CHANGE:` footer.

- Pre-1.0: breaking change → **minor** bump (`0.1.x` → `0.2.0`)
- Post-1.0: breaking change → **major** bump (`1.2.3` → `2.0.0`)

```
feat!: rename @studio/timing.stagger → staggerFrames

BREAKING CHANGE: callers must update imports.
```

## Releasing a version

1. Land commits to `main` with Conventional Commit messages.
2. Release Please opens (or updates) a PR titled `chore(main): release <version>`.
3. Review the PR — check the proposed version bump and the CHANGELOG diff.
4. **Merge the Release PR.**
5. Release Please automatically:
   - creates the `v<version>` git tag,
   - publishes a GitHub Release with the CHANGELOG entry,
   - updates `.github/.release-please-manifest.json`.

## CI on the Release PR

PRs created by `GITHUB_TOKEN` do **not** trigger other workflows automatically, so `ci.yml` will not run on the Release PR at creation time.

Options to get CI coverage:

- Push any commit to the Release PR branch (even an empty commit: `git commit --allow-empty -m "ci: trigger"`).
- Close and reopen the Release PR.
- Provide a Personal Access Token (`repo` + `workflow` scopes) as a repo secret `RELEASE_PAT` and update `.github/workflows/release.yml`:
  ```yaml
  token: ${{ secrets.RELEASE_PAT }}
  ```

## Forcing a specific version

Edit `.github/release-please-config.json` and set `release-as` on the package:

```json
"packages": {
  ".": {
    "release-as": "1.0.0"
  }
}
```

Merge that change to `main`, then let Release Please open the next Release PR. Remove `release-as` afterwards.

## Files involved

| File                                    | Purpose                                                |
| --------------------------------------- | ------------------------------------------------------ |
| `.github/workflows/release.yml`         | Triggers Release Please on pushes to `main`            |
| `.github/release-please-config.json`    | Release Please configuration (sections, bump strategy) |
| `.github/.release-please-manifest.json` | Last-released version (managed automatically)          |
| `CHANGELOG.md`                          | Generated changelog (managed automatically)            |
| `package.json`                          | Root `version` field (bumped automatically)            |

## Scope

Only the **monorepo root** (`remotion-studio`) is versioned. The `@studio/*` workspace packages are internal (consumed via webpack alias) and are not published to npm.
