export function postVisitPing(input: { path: string; referrer?: string }) {
  return fetch("/api/visit", {
    body: JSON.stringify(input),
    credentials: "same-origin",
    headers: { "content-type": "application/json" },
    keepalive: true,
    method: "POST",
  });
}
