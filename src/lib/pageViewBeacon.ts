import type { PageViewInput } from "@/lib/pageViewInput";

export function sendPageView(apiOrigin: string, view: PageViewInput) {
  void fetch(`${apiOrigin}/v1/views`, {
    body: JSON.stringify(view),
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    method: "POST",
  }).catch(() => undefined);
}
