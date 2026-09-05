"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { AnimalGroup } from "@/data/speciesAtlas";
import type { AdminSpeciesSummary } from "@/lib/adminGalleryMdx";

import { CoverImage } from "@/components/CoverImage";
import { cn } from "@/lib/cn";

const GROUP_LABEL: Record<AnimalGroup, string> = {
  amphibian: "ამფიბიები",
  bird: "ფრინველები",
  lizard: "ხვლიკები",
  mammal: "ძუძუმწოვრები",
  snake: "გველები",
  spider: "ობობები",
  turtle: "კუები",
};

const GROUPS: Array<"all" | AnimalGroup> = [
  "all",
  "snake",
  "lizard",
  "turtle",
  "amphibian",
  "bird",
  "mammal",
  "spider",
];

export function AdminSpeciesList({
  species,
}: {
  species: AdminSpeciesSummary[];
}) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<"all" | AnimalGroup>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return species.filter((item) => {
      if (group !== "all" && item.group !== group) return false;
      if (!q) return true;
      return (
        item.id.includes(q) ||
        item.commonName.toLowerCase().includes(q) ||
        item.scientificName.toLowerCase().includes(q)
      );
    });
  }, [species, query, group]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="sr-only" htmlFor="admin-species-search">
          სახელი ან id
        </label>
        <input
          className="h-11 w-full rounded-lg border border-border bg-card px-3 text-[14px] outline-none focus:border-primary sm:max-w-sm"
          id="admin-species-search"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="სახელი ან id"
          value={query}
        />
        <div className="flex flex-wrap gap-1.5">
          {GROUPS.map((item) => (
            <button
              className={cn(
                "rounded-full px-3 py-1.5 text-[12px]",
                group === item
                  ? "bg-foreground text-background"
                  : "bg-secondary text-muted-foreground",
              )}
              key={item}
              onClick={() => setGroup(item)}
              type="button"
            >
              {item === "all" ? "ყველა" : GROUP_LABEL[item]}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-4 text-[12px] text-muted-foreground">
        {filtered.length} სახეობა
      </p>
      <ul className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
        {filtered.map((item) => (
          <li key={item.id}>
            <Link
              className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-secondary/60"
              href={`/admin/${item.id}`}
            >
              <span className="media-placeholder relative size-12 shrink-0 overflow-hidden rounded-md bg-secondary">
                {item.image ? (
                  <CoverImage
                    alt=""
                    className="object-cover"
                    sizes="48px"
                    src={item.image}
                  />
                ) : null}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">
                  {item.commonName}
                </span>
                <span className="block truncate text-[12px] text-muted-foreground">
                  {item.scientificName}
                </span>
              </span>
              <span className="shrink-0 text-[12px] text-muted-foreground">
                {item.galleryCount}
                {item.unpublished ? " · unpublished" : ""}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
