import { absoluteUrl } from "@/lib/site";

export function GET() {
  const body = [
    "User-Agent: *",
    "Allow: /",
    "Disallow: /api/",
    "Disallow: /admin",
    "Disallow: /admin/",
    "",
    `Sitemap: ${absoluteUrl("/sitemap.xml")}`,
    `# ${absoluteUrl("/llms.txt")}`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
