export type ConfigHeader = { key: string; value: string };

export const SITE_HEADERS_SOURCE = "/(.*)";

export const CONTENT_SECURITY_POLICY = "Content-Security-Policy";

export const STRICT_TRANSPORT_SECURITY: ConfigHeader = {
  key: "Strict-Transport-Security",
  value: "max-age=31536000",
};

const SCRIPT_SRC = "script-src";
const UNSAFE_INLINE = "'unsafe-inline'";

export function scriptSourceOrigins(policy: string): string[] {
  return (directiveSources(policy, SCRIPT_SRC) ?? []).flatMap((source) =>
    /^https:\/\/[a-z0-9.-]+$/i.test(source) ? [new URL(source).origin] : [],
  );
}

export function securityHeaders(isDevelopment: boolean): ConfigHeader[] {
  return [
    {
      key: CONTENT_SECURITY_POLICY,
      value: contentSecurityPolicy(isDevelopment),
    },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    ...(isDevelopment
      ? []
      : [{ key: "X-Frame-Options", value: "DENY" }, STRICT_TRANSPORT_SECURITY]),
  ];
}

export function withScriptNonce(policy: string, nonce: string): string {
  return parseDirectives(policy)
    .map(([name, ...sources]) =>
      name === SCRIPT_SRC
        ? [
            name,
            ...sources.filter((source) => source !== UNSAFE_INLINE),
            `'nonce-${nonce}'`,
            "'strict-dynamic'",
          ]
        : [name, ...sources],
    )
    .map((tokens) => tokens.join(" "))
    .join("; ");
}

function contentSecurityPolicy(isDevelopment: boolean) {
  const directives = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com https://counter.top.ge${isDevelopment ? " https://unpkg.com" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://cdn.reptiles.ge https://upload.wikimedia.org https://tile.openstreetmap.de https://tile.openstreetmap.org https://www.googletagmanager.com https://www.google-analytics.com https://stats.g.doubleclick.net https://*.google.com https://*.google.ge https://counter.top.ge",
    "media-src 'self' https://cdn.reptiles.ge",
    "font-src 'self' data:",
    `connect-src 'self' https://api.reptiles.ge https://cdn.reptiles.ge https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com https://*.google-analytics.com https://*.analytics.google.com https://stats.g.doubleclick.net https://*.sentry.io${isDevelopment ? " http://localhost:8787 https://www.react-grab.com" : ""}`,
    "frame-src https://www.googletagmanager.com",
    "base-uri 'self'",
    "form-action 'self'",
  ];

  directives.push(
    isDevelopment ? "worker-src 'self' blob:" : "frame-ancestors 'none'",
  );

  return directives.join("; ");
}

function directiveSources(policy: string, name: string) {
  return parseDirectives(policy)
    .find(([directive]) => directive === name)
    ?.slice(1);
}

function parseDirectives(policy: string): string[][] {
  return policy
    .split(";")
    .map((part) => part.trim().split(/\s+/))
    .filter(([name]) => Boolean(name));
}
