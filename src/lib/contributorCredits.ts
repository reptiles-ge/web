import type { AuthorKind, AuthorProfile } from "@/data/authors";
import type { PhotoCredit } from "@/data/speciesTypes";

export type ContributorDirectory = {
  byAlias: Readonly<Record<string, string>>;
  byId: Readonly<Record<string, { kind: AuthorKind; name: string }>>;
};

export const NO_CONTRIBUTORS: ContributorDirectory = { byAlias: {}, byId: {} };

export function contributorDirectory(
  contributors: readonly Pick<
    AuthorProfile,
    "aliases" | "id" | "kind" | "name"
  >[],
): ContributorDirectory {
  return {
    byAlias: Object.fromEntries(
      contributors.flatMap((author) =>
        author.aliases.map((alias) => [alias, author.id]),
      ),
    ),
    byId: Object.fromEntries(
      contributors.map((author) => [
        author.id,
        { kind: author.kind, name: author.name },
      ]),
    ),
  };
}

export function creditContributor(
  directory: ContributorDirectory,
  credit: Pick<PhotoCredit, "authorId" | "photographer"> | undefined,
) {
  const photographer = credit?.photographer?.trim();
  const id =
    credit?.authorId ??
    (photographer ? directory.byAlias[photographer] : undefined);
  const author = id ? directory.byId[id] : undefined;
  return id && author ? { id, ...author } : undefined;
}
