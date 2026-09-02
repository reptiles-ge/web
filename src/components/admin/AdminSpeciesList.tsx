"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { AdminSpeciesSummary } from "@/lib/adminGalleryMdx";
import type { AnimalGroup } from "@/data/speciesAtlas";

const GROUP_LABEL: Record<AnimalGroup, string> = {
  snake: "გველები",
  lizard: "ხვლიკები",
  turtle: "კუები",
  amphibian: "ამფიბიები",
  bird: "ფრინველები",
  mammal: "ძუძუმწოვრები",
  spider: "ობობები",
};

const GROUPS: Array<AnimalGroup | "all"> = [
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
  const [group, setGroup] = useState<AnimalGroup | "all">("all");

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
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="სახელი ან id"
          className="h-11 w-full rounded-lg border border-border bg-card px-3 text-[14px] outline-none focus:border-primary sm:max-w-sm"
        />
        <div className="flex flex-wrap gap-1.5">
          {GROUPS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setGroup(item)}
              className={`rounded-full px-3 py-1.5 text-[12px] ${
                group === item
                  ? "bg-foreground text-background"
                  : "bg-secondary text-muted-foreground"
              }`}
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
              href={`/admin/${item.id}`}
              className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-secondary/60"
            >
              <span className="relative size-12 shrink-0 overflow-hidden rounded-md bg-secondary">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-cover"
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
