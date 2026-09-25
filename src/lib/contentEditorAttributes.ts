export function contentEditorAttributes(
  kind: "guide" | "message" | "news" | "region" | "species",
  id: string | undefined,
  field: string,
) {
  return id
    ? {
        "data-content-field": field,
        "data-content-id": id,
        "data-content-kind": kind,
      }
    : {};
}
