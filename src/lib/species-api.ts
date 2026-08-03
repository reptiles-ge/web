import type { Species } from "@/data/species";
import { headers } from "next/headers";

export type SpeciesDetailResponse = {
  species: Species;
  related: Species[];
};

async function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, "");
  }

  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const protocol =
    headerStore.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "development" ? "http" : "https");

  if (!host) {
    return "http://localhost:3000";
  }

  return `${protocol}://${host}`;
}

export async function fetchSpeciesDetail(
  id: string,
): Promise<SpeciesDetailResponse | null> {
  const baseUrl = await getBaseUrl();
  const response = await fetch(`${baseUrl}/api/species/${id}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to load species: ${response.status}`);
  }

  return response.json() as Promise<SpeciesDetailResponse>;
}

export async function fetchSpeciesIds(): Promise<string[]> {
  const baseUrl = await getBaseUrl();
  const response = await fetch(`${baseUrl}/api/species`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as {
    species: Array<{ id: string }>;
  };

  return data.species.map((item) => item.id);
}
