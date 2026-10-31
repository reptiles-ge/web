import { routing } from "@/i18n/routing";
import { llmsFullPath, llmsIndexPath } from "@/lib/llmsPaths";
import { absoluteUrl } from "@/lib/site";

const ROBOTS_DISALLOWED_PATHS = ["/api/", "/admin", "/admin/"] as const;
export const CONTENT_SIGNAL = "search=yes, ai-input=yes, ai-train=yes";

export const AI_CITATION_USER_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "anthropic-ai",
  "Google-Extended",
  "Bingbot",
  "Applebot",
  "Applebot-Extended",
] as const;

export function buildRobotsTxt() {
  const llmsTxt = absoluteUrl(llmsIndexPath(routing.defaultLocale));
  const llmsFull = absoluteUrl(llmsFullPath(routing.defaultLocale));
  const sitemap = absoluteUrl("/sitemap.xml");

  const rules = [
    `Content-Signal: ${CONTENT_SIGNAL}`,
    "Allow: /",
    ...ROBOTS_DISALLOWED_PATHS.map((path) => `Disallow: ${path}`),
    "",
  ];
  const aiBlocks = AI_CITATION_USER_AGENTS.flatMap((agent) => [
    `User-agent: ${agent}`,
    ...rules,
  ]);

  return [
    "# reptiles.ge — public atlas of animals of Georgia",
    "# AI crawlers: citation and summarization of published pages is welcome.",
    `# Prefer ${llmsTxt} (index) and ${llmsFull} (extractable corpus).`,
    "# English, Russian and Turkish have their own pair under /en/, /ru/ and /tr/.",
    "# Do not treat empty atlas fields as negative evidence.",
    "",
    "User-agent: *",
    ...rules,
    ...aiBlocks,
    `Sitemap: ${sitemap}`,
    ...routing.locales.flatMap((locale) => [
      `# llms.txt (${locale}): ${absoluteUrl(llmsIndexPath(locale))}`,
      `# llms-full.txt (${locale}): ${absoluteUrl(llmsFullPath(locale))}`,
    ]),
    "",
  ].join("\n");
}

export function llmsTextResponseHeaders(options?: { noindex?: boolean }) {
  return {
    "Cache-Control":
      "public, max-age=3600, s-maxage=3600, stale-while-revalidate=604800",
    "Content-Type": "text/plain; charset=utf-8",
    ...(options?.noindex ? { "X-Robots-Tag": "noindex, follow" } : {}),
  };
}
