export type ConfigHeader = { key: string; value: string };

export const SITE_HEADERS_SOURCE = "/(.*)";

export const STRICT_TRANSPORT_SECURITY: ConfigHeader = {
  key: "Strict-Transport-Security",
  value: "max-age=31536000",
};

export function contentSecurityPolicy(isDevelopment: boolean) {
  const directives = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com https://counter.top.ge${isDevelopment ? " https://unpkg.com" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://cdn.reptiles.ge https://upload.wikimedia.org https://tile.openstreetmap.de https://tile.openstreetmap.org https://www.googletagmanager.com https://www.google-analytics.com https://stats.g.doubleclick.net https://*.google.com https://*.google.ge https://counter.top.ge",
    "media-src 'self' https://cdn.reptiles.ge",
    "font-src 'self' data:",
    `connect-src 'self' https://cdn.reptiles.ge https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com https://*.google-analytics.com https://*.analytics.google.com https://stats.g.doubleclick.net https://*.sentry.io${isDevelopment ? " https://www.react-grab.com" : ""}`,
    "frame-src https://www.googletagmanager.com",
    "base-uri 'self'",
    "form-action 'self'",
  ];

  directives.push(
    isDevelopment ? "worker-src 'self' blob:" : "frame-ancestors 'none'",
  );

  return directives.join("; ");
}

export function securityHeaders(isDevelopment: boolean): ConfigHeader[] {
  return [
    {
      key: "Content-Security-Policy",
      value: contentSecurityPolicy(isDevelopment),
    },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    ...(isDevelopment
      ? []
      : [{ key: "X-Frame-Options", value: "DENY" }, STRICT_TRANSPORT_SECURITY]),
  ];
}
