# Pinned and patched dependencies

Five dependencies are held back on purpose. Dependabot does not update them. Change them by hand, with the steps below.

## vinext (patched)

`vinext` is pinned to `1.4.0` and `@vinext/cloudflare` to `1.3.0`. `patches/vinext@1.4.0.patch` (wired in `package.json` → `pnpm.patchedDependencies`) changes `dist/server/streaming-metadata.js`.

**Why.** `next.config.ts` sets `htmlLimitedBots` to match every user agent, so page metadata always renders in `<head>`. Unpatched vinext ignores that setting when the `User-Agent` is empty and streams the `<title>`, description, canonical, `robots` and `hreflang` tags into a hidden body boundary instead. The response store regenerates pages with requests that carry no user agent, and it serves that cached copy to every visitor, crawlers included (#1132). The patch applies `htmlLimitedBots` to an empty user agent too. `src/lib/metadataPlacement.test.ts` imports the installed file and fails if the fix is missing, and `pnpm metadata:check` checks a running build.

**Upstream status (2026-10-29).** `1.4.0` still ships the unpatched function. Since `1.1.0` vinext renders regenerations and cache warm-ups in full (cloudflare/vinext#3435), but a cold miss with no `User-Agent` still streams the metadata (cloudflare/vinext#3764), so the patch stays until that issue is fixed.

**Dependabot.** `vinext`, `@vinext/*` and `@cloudflare/workers-response-store` are in `ignore` in `.github/dependabot.yml`. A response-store bump on its own leaves the direct dependency ahead of the version `@vinext/cloudflare` pins, so the lockfile carries two copies and `wrangler.response-store.jsonc` deploys a different store than the site talks to (#1859). A bump that misses the patch key would fail `pnpm install`, and it used to block the whole `worker-build` group with it.

**Release age.** `vinext@1.4.0`, `@vinext/cloudflare@1.3.0` and `@vinext/types@1.0.2` are in `minimumReleaseAgeExclude` in `pnpm-workspace.yaml`, because the upgrade from `1.0.1` (#1745) was taken a day after the release. Remove these three entries once the versions are 7 days old (2026-11-04); later vinext versions follow the normal 7-day rule.

**To upgrade:**

1. Read the new version's `dist/server/streaming-metadata.js`. If it now treats an empty user agent like the patch does, drop the patch. Otherwise, port the patch to the new version.
2. Bump `vinext` and `@vinext/cloudflare` together in `package.json` (`@vinext/cloudflare` pins its own `@cloudflare/workers-response-store`; keep the direct dependency on the same version). Rename the `patchedDependencies` key and the patch file to the new version, or remove both.
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

## @swc/core (pinned to 1.16.2)

`@swc/core` is not a direct dependency. `next-intl/plugin` requires it as soon as `next.config.ts` loads, so every build loads its native addon. `package.json` → `pnpm.overrides` pins it to `1.16.2`, inside `next-intl`'s `~1.16.0` range.

**Why.** From `1.16.12` the Linux package ships a compressed addon that unpacks itself into a cache folder on first load. Before it does, it checks every parent of that folder and refuses to load if one is writable by another user without the sticky bit (`ERR_SWC_NATIVE_CACHE`, "cache root has a parent writable by another user without trusted sticky protection"). On 2026-11-13 the Cloudflare Workers Builds image started failing that check for both `/opt/buildhome/.cache` and `/tmp/swc-native` (set through `SWC_NATIVE_BINDING_CACHE`), so `vinext build` stopped at "Failed to load next.config.ts: Failed to load native binding". `1.16.2` is the last release that ships a plain `.node` file with no cache step.

**Dependabot.** `@swc/*` is in `ignore` in `.github/dependabot.yml`.

**To upgrade:** check that a newer `@swc/core` loads with an unsafe cache parent, or that the Cloudflare build image passes the check again. Locally: `mkdir -m 777 /tmp/x && mkdir -m 700 /tmp/x/cache`, then `HOME=/tmp/x XDG_CACHE_HOME=/tmp/x/cache node -e 'require("@swc/core")'` from a folder that resolves `@swc/core` (macOS: use `/private/tmp`, because `/tmp` is a symlink). Then remove the override, run `pnpm install`, and confirm the next Workers Build passes before merging to `main`.
