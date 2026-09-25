import { describe, expect, it } from "vitest";

import { findSpeciesPullRequest } from "@/lib/contentEditorPullRequest";

const speciesPullRequest = {
  baseRefName: "staging",
  files: [
    { path: "src/content/species/phasianus-colchicus/ka.mdx" },
    { path: "src/content/species/phasianus-colchicus/en.mdx" },
  ],
  headRefName: "feature/content-editor-phasianus-colchicus-50242e26",
  isCrossRepository: false,
  url: "https://github.com/reptiles-ge/web/pull/565",
};

describe("existing species pull requests", () => {
  it("reuses the open PR that edits the same species on the target branch", () => {
    expect(
      findSpeciesPullRequest(
        [
          {
            ...speciesPullRequest,
            files: [{ path: "src/components/SpeciesProfile.tsx" }],
          },
          speciesPullRequest,
        ],
        "phasianus-colchicus",
        "staging",
      ),
    ).toEqual(speciesPullRequest);
    expect(
      findSpeciesPullRequest(
        [speciesPullRequest],
        "darevskia-clarkorum",
        "staging",
      ),
    ).toBeNull();
    expect(
      findSpeciesPullRequest(
        [speciesPullRequest],
        "phasianus-colchicus",
        "main",
      ),
    ).toBeNull();
  });

  it("refuses ambiguous or forked species branches", () => {
    expect(() =>
      findSpeciesPullRequest(
        [
          speciesPullRequest,
          {
            ...speciesPullRequest,
            url: "https://github.com/reptiles-ge/web/pull/566",
          },
        ],
        "phasianus-colchicus",
        "staging",
      ),
    ).toThrow(/Multiple open/);
    expect(() =>
      findSpeciesPullRequest(
        [{ ...speciesPullRequest, isCrossRepository: true }],
        "phasianus-colchicus",
        "staging",
      ),
    ).toThrow(/fork/);
  });
});
