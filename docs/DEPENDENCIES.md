# Pinned and patched dependencies

Four dependencies are held back on purpose. Dependabot does not update them. Change them by hand, with the steps below.

## vinext (patched)

`vinext` and `@vinext/cloudflare` are pinned to `1.0.1`. `patches/vinext@1.0.1.patch` (wired in `package.json` → `pnpm.patchedDependencies`) changes `dist/server/streaming-metadata.js`.

**Why.** `next.config.ts` sets `htmlLimitedBots` to match every user agent, so page metadata always renders in `<head>`. Unpatched vinext ignores that setting when the `User-Agent` is empty and streams the `<title>`, description, canonical, `robots` and `hreflang` tags into a hidden body boundary instead. The response store regenerates pages with requests that carry no user agent, and it serves that cached copy to every visitor, crawlers included (#1132). The patch applies `htmlLimitedBots` to an empty user agent too. `src/lib/metadataPlacement.test.ts` imports the installed file and fails if the fix is missing, and `pnpm metadata:check` checks a running build.

**Upstream status (2026-10-18).** `1.1.0`, `1.2.0` and `1.2.1` still ship the unpatched function, so the patch is needed on every current release.

**Dependabot.** `vinext` and `@vinext/*` are in `ignore` in `.github/dependabot.yml`. A bump that misses the patch key would fail `pnpm install`, and it used to block the whole `worker-build` group with it.

**Release age.** `vinext` and `@vinext/*` follow the normal 7-day `minimumReleaseAge` in `pnpm-workspace.yaml`. No exemption.

**To upgrade:**

1. Read the new version's `dist/server/streaming-metadata.js`. If it now treats an empty user agent like the patch does, drop the patch. Otherwise, port the patch to the new version.
2. Bump `vinext` and `@vinext/cloudflare` together in `package.json`. Rename the `patchedDependencies` key and the patch file to the new version, or remove both.
3. Run `pnpm install`, `pnpm test` (including `metadataPlacement.test.ts`), `pnpm build:vinext` and `pnpm test:e2e`.

## @reptiles-ge/img-compression (git commit)

`@reptiles-ge/img-compression` comes from GitHub, pinned to a commit SHA, not a branch. It renders the guide share images (`pnpm images:og-guides`).

**Why a SHA.** A branch reference moves to the branch head on every lockfile refresh, unreviewed, and installs fail if the branch is deleted. `onlyBuiltDependencies` in `pnpm-workspace.yaml` allows the build script for one exact codeload tarball only. A new commit's build script would be skipped silently.

**To move to another commit,** change all three places to the same SHA:

1. `package.json` → `github:reptiles-ge/img-compression#<sha>`
2. `pnpm-workspace.yaml` → `onlyBuiltDependencies` tarball URL
3. `pnpm install`, then check the lockfile resolves to `codeload.github.com/reptiles-ge/img-compression/tar.gz/<sha>`, and run `pnpm images:og-guides --guide <id>` once.

## typescript (major held at 6)

`typescript` stays on `^6`. Dependabot does not open major bumps for it.

**Why.** `typescript-eslint` (pulled in by `eslint-config-next`) throws at startup on TypeScript 7.0: "typescript-eslint does not support TS 7.0". Its peer range is `typescript >=4.8.4 <6.1.0` as of `8.72.1`. The 7.0.2 bump (#1705) passed typecheck and build but broke `pnpm lint` in CI on every pull request after it.

**Dependabot.** `typescript` major updates are in `ignore` in `.github/dependabot.yml`. Minor and patch updates still arrive in their group.

**To upgrade:** wait for a `typescript-eslint` release whose `typescript` peer range includes 7, bump both, then run `pnpm install`, `pnpm lint`, `pnpm typecheck` and `pnpm build`.

## msw (major held at 2)

`msw` stays on `^2`. Dependabot does not open major bumps for it.

**Why.** The 3.0.3 bump (#1706) broke the test suite. `server.listen({ onUnhandledRequest })` no longer type-checks in `tests/setup/msw.ts`, and handlers see `request.credentials` as `same-origin` where the admin clients send `include`, so the admin client tests that check credentials fail. CI did not show it because `pnpm typecheck` and `pnpm test:coverage` run after `pnpm lint`, which was failing on TypeScript 7 at the same time.

**Dependabot.** `msw` major updates are in `ignore` in `.github/dependabot.yml`. Minor and patch updates still arrive.

**To upgrade:** follow the msw 3 migration guide for `tests/setup/msw.ts` and `tests/msw/`, then run `pnpm typecheck` and `pnpm test:coverage` until both pass.
