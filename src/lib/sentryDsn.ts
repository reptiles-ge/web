export const SENTRY_DSN =
  "https://6db3fcbf0eebe4b852d9498135a5678f@o4510170297073664.ingest.us.sentry.io/4512117330608128";

export function sentrySecurityEndpoint(dsn: string): string {
  const url = new URL(dsn);
  const projectId = url.pathname.split("/").filter(Boolean).at(-1);
  const query = new URLSearchParams({
    sentry_environment: "production",
    sentry_key: url.username,
  });
  return `${url.origin}/api/${projectId}/security/?${query}`;
}
