import type { ContentViewInput } from "@/lib/contentViewInput";

export function sendContentView(apiOrigin: string, view: ContentViewInput) {
  void fetch(`${apiOrigin}/v1/views`, {
    body: JSON.stringify(view),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  }).catch(() => undefined);
}
