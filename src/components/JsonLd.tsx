import type { Graph, Thing, WithContext } from "schema-dts";

export type JsonLdData =
  | Graph
  | readonly (Graph | Record<string, unknown> | WithContext<Thing>)[]
  | Record<string, unknown>
  | WithContext<Thing>;

export function JsonLd({ data }: { data: JsonLdData }) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
      type="application/ld+json"
    />
  );
}
