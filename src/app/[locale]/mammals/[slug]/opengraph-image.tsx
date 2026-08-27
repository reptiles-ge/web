import {
  speciesOgAlt as alt,
  speciesOgContentType as contentType,
  speciesOgSize as size,
  speciesOpengraphResponse,
} from "@/lib/speciesOpengraph";

export { alt, contentType, size };

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return speciesOpengraphResponse(slug);
}
