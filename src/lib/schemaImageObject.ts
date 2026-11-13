export function schemaImageObject<Rights extends object>(
  url: string,
  dimensions: { height?: number; width?: number },
  rights: Rights,
) {
  return {
    "@type": "ImageObject" as const,
    contentUrl: url,
    url,
    ...dimensions,
    ...rights,
  };
}
