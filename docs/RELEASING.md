# Releasing reptiles.ge

How versions and GitHub Releases work in `reptiles-ge/web`. Written for AI agents and humans. If you are an agent asked to "cut a release", "bump the version", or "write release notes", follow this file exactly.

## The model in one paragraph

Work lands on `staging` through pull requests. A `Staging to main` pull request moves it to `main`, and every push to `main` deploys to production at [reptiles.ge](https://reptiles.ge). That happens several times a day. A **release** is not a deploy: it is a named, versioned checkpoint of what is already live, cut from `main` when a meaningful batch of work has shipped. The Git tag is the version. [GitHub Releases](https://github.com/reptiles-ge/web/releases) is the changelog.

```text
feature branch ──PR──▶ staging ──"Staging to main" PR──▶ main ──▶ production deploy
                                                           │
                                                           └── tag vX.Y.Z + GitHub Release (on request)
```

## Rules

1. Tags are `vMAJOR.MINOR.PATCH` (for example `v1.4.2`). No other tag format.
2. Tags point only at commits that are on `main` and already deployed. Never tag `staging` or a feature branch.
3. A published tag is immutable. Never move, delete, or reuse one. A bad release is fixed by a new, higher version.
4. Only the repository owner decides when to release. An agent never cuts a release unprompted. An agent may say "this looks like a good point for `v1.3.0`" and stop there.
5. The tag is the single source of truth for the version. Do not bump `version` in `package.json` (the package is private and nothing reads it), and do not add a `CHANGELOG.md`. Both would need extra commits on `main` and drift from the tags.
6. No pre-releases, release branches, or release candidates. `staging` already plays that role.
7. One release at a time, in order. Do not skip numbers and do not backfill old versions.

## Choosing the version

This is a website, not a library, so "breaking" means breaking for visitors, search engines, and links, not for an API. Pick the highest level that applies to anything shipped since the previous release.

| Bump  | When                                                                 | Examples                                                                                                                                                       |
| ----- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MAJOR | The site changes shape. Rare, and always an explicit owner decision. | Site-wide redesign, a new public URL scheme, removing a locale or a whole section, a platform migration visitors can notice                                    |
| MINOR | Visitors get something new.                                          | New species profiles, a new hub, cluster guide, guide article, quiz, or locale, a new region feature, a new site capability such as search or maps             |
| PATCH | What exists gets better or gets fixed. Nothing new to discover.      | Bug fixes, content corrections, copy and translation edits, photo and credit changes, SEO and performance work, dependency updates, CI, refactors, tests, docs |

Tie-breakers:

- One new species profile is enough for MINOR.
- Editing an existing profile, however large the edit, is PATCH.
- A changed public URL that keeps a 301 from the old one is PATCH or MINOR, never MAJOR on its own.
- If the range contains only dependency, CI, or tooling changes, it is still a PATCH if the owner wants a release.
- When unsure between two levels, propose the lower one and say why.

## Pull request labels

Release notes are generated from merged pull requests and grouped by label using `.github/release.yml`. Put exactly one of these on every pull request into `staging`:

| Label            | Use for                                                          | Section in the notes |
| ---------------- | ---------------------------------------------------------------- | -------------------- |
| `enhancement`    | New features and new pages                                       | New                  |
| `content`        | Page text, internal links, and photos (upload, replace, reorder) | Content              |
| `bug`            | Fixes                                                            | Fixes                |
| `documentation`  | Docs and agent instructions                                      | Maintenance          |
| `dependencies`   | Dependency updates (Dependabot sets this itself)                 | Dependencies         |
| `skip-changelog` | `Staging to main` pull requests and anything not worth listing   | Hidden               |

Use `content` whenever the pull request works on what a specific page says or shows, not on how the site works:

- editing page text in any locale, including a typo or factual correction;
- adding, changing, or removing internal links on a page;
- uploading, replacing, or removing a photo;
- reordering photos in a gallery, or changing a hero image, credit, or caption.

A correction to page text or photos is `content`, not `bug`. `bug` is for broken behaviour in code. If a pull request mixes page content with a code change, label it for the code change.

Unlabelled pull requests still appear, under "Other changes". Label the `Staging to main` pull request `skip-changelog` so it does not show up as noise.

Write pull request titles as one plain sentence about the outcome ("Add the Caucasian viper bite guide", not "updates"). The title is the release note line.

## Cutting a release

Run these from any checkout. Replace `vX.Y.Z` with the new version and `vPREV` with the previous tag.

**1. Find the previous release and what shipped since.**

```bash
git fetch origin main --tags
```

```bash
gh release view --repo reptiles-ge/web --json tagName,publishedAt
```

```bash
git log vPREV..origin/main --merges --first-parent --oneline
```

If the log is empty, there is nothing to release. Stop and say so.

**2. Check that `main` is healthy.**

```bash
gh run list --repo reptiles-ge/web --branch main --limit 5
```

The `Lint` run for the head commit of `main` must be green and `Warm cache` must be finished (it waits for the production deploy). Then confirm the site answers:

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://reptiles.ge/
```

It must print `200`. If `Lint` is red, the deploy is still running, the site is not `200`, or maintenance mode is on, do not release. Report it instead.

**3. Choose the version** with the table above and tell the owner which level you picked and why, in one sentence.

**4. Write the highlights.** Two to five bullets, plain language, written for someone who visits the site and has never seen the repository. Lead with what a visitor can now do or see. Follow the content rules in `AGENTS.md`: do not invent counts, species totals, or claims that are not in the merged work.

**5. Publish**, pinned to the exact commit:

```bash
gh release create vX.Y.Z \
  --repo reptiles-ge/web \
  --target "$(git rev-parse origin/main)" \
  --title "vX.Y.Z" \
  --notes-start-tag vPREV \
  --generate-notes \
  --notes "## Highlights

- First highlight.
- Second highlight."
```

`--notes` goes on top, the generated pull request list goes underneath. The title is the version and nothing else.

**6. Verify and report.**

```bash
gh release view vX.Y.Z --repo reptiles-ge/web --json tagName,targetCommitish,url
```

Report the version, the commit, and the release URL.

## Version in the footer

The footer shows the latest release tag as plain text. Nothing is committed for it: `scripts/compile-release-version.ts` runs with `species:compile` and writes the gitignored `src/data/releaseVersion.generated.ts`.

It resolves the tag in this order: the `RELEASE_VERSION` variable, the nearest `vX.Y.Z` tag in the checked-out history, then the highest `vX.Y.Z` tag on `origin` (for shallow clones without tags). If none is found the footer shows no version.

A release is tagged after its commit is already live, so the footer changes to the new version on the next deploy of `main`, not at the moment the release is published.

## Fixing things after a release

- **Wrong or thin notes:** edit them with `gh release edit vX.Y.Z --notes-file <file>`. Editing notes is fine. Moving the tag is not.
- **A bug shipped in the release:** fix it through the normal `staging` to `main` flow, then cut the next PATCH. Do not delete the release.
- **Production is broken right now:** restoring the site comes first and is separate from versioning. Roll back the deployment in Cloudflare or revert the offending merge on `main`; use maintenance mode (see `AGENTS.md`) only as a last resort. Once `main` is healthy again, cut a PATCH that describes the revert.
- **The tag was put on the wrong commit and nobody has used it yet:** ask the owner before touching it. Deleting a tag is their call.

## What agents must not do

- Cut, edit, or delete a release without being asked.
- Tag anything that is not on `main` and live.
- Force-push, move, or delete a tag.
- Bump `package.json` or add a changelog file "to match" the release.
- Run `--generate-notes` without `--notes-start-tag` (the range becomes ambiguous).
- Pad the highlights with numbers or claims that the merged pull requests do not support.

## History

| Version  | Date       | Note                                                                                  |
| -------- | ---------- | ------------------------------------------------------------------------------------- |
| `v1.0.0` | 2026-10-08 | First tagged release. Baseline of the live site; everything before it is unversioned. |

Later versions are listed on [GitHub Releases](https://github.com/reptiles-ge/web/releases), not here.
