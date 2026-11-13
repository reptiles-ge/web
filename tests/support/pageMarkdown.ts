import { markdownResponse } from "@/lib/markdownNegotiation";

export async function pageMarkdown(html: string, url: string) {
  const response = await markdownResponse(
    new Request(url, { headers: { Accept: "text/markdown" } }),
    new Response(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    }),
  );
  return response.text();
}
