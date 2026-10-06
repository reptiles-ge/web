type MaintenanceCopy = {
  body: string;
  heading: string;
  status: string;
  title: string;
};

type MaintenanceLocale = "en" | "ka" | "ru" | "tr";

export const MAINTENANCE_HEADER = "x-reptiles-maintenance";
export const MAINTENANCE_BYPASS_HEADER = "x-maintenance-bypass";
export const MAINTENANCE_BYPASS_COOKIE = "maintenance_bypass";
export const MAINTENANCE_RETRY_AFTER_SECONDS = 3600;

const REFRESH_SECONDS = 120;
const LOGO_SRC = "/images/logo-160.webp";
const ON_VALUES = new Set(["1", "on", "true"]);
const PASSTHROUGH_PATHS = new Set(["/robots.txt"]);

const LOCALES: { href: string; label: string; locale: MaintenanceLocale }[] = [
  { href: "/", label: "ქართული", locale: "ka" },
  { href: "/en", label: "English", locale: "en" },
  { href: "/ru", label: "Русский", locale: "ru" },
  { href: "/tr", label: "Türkçe", locale: "tr" },
];

const COPY: Record<MaintenanceLocale, MaintenanceCopy> = {
  en: {
    body: "We're updating the atlas. Species profiles and every link will return at the same address.",
    heading: "We'll be back shortly",
    status: "Maintenance in progress",
    title: "Temporarily down for maintenance — Reptiles.ge",
  },
  ka: {
    body: "ატლასს ვაახლებთ. სახეობების პროფილები და ყველა ბმული იმავე მისამართზე დაბრუნდება.",
    heading: "მალე დავბრუნდებით",
    status: "ტექნიკური სამუშაოები",
    title: "საიტი დროებით ტექნიკურ სამუშაოებზეა — Reptiles.ge",
  },
  ru: {
    body: "Мы обновляем атлас. Профили видов и все ссылки вернутся по прежним адресам.",
    heading: "Скоро вернёмся",
    status: "Технические работы",
    title: "Сайт временно на техническом обслуживании — Reptiles.ge",
  },
  tr: {
    body: "Atlası güncelliyoruz. Tür profilleri ve tüm bağlantılar aynı adreslerde geri dönecek.",
    heading: "Kısa süre sonra döneceğiz",
    status: "Bakım çalışması",
    title: "Geçici olarak bakımda — Reptiles.ge",
  },
};

const STYLE = `
:root{color-scheme:light dark;--bg:#f4f6f2;--fg:#1a211c;--card:#fafbf8;--muted:#5c665f;--primary:#2f6b4f;--border:#d5ddd4;--glow:rgba(47,107,79,.16);--glow2:rgba(125,98,36,.1)}
@media (prefers-color-scheme:dark){:root{--bg:#0f1411;--fg:#e8eee6;--card:#161c18;--muted:#9aa69c;--primary:#6fad88;--border:#2a342e;--glow:rgba(111,173,136,.14);--glow2:rgba(212,176,92,.07)}}
*{box-sizing:border-box}
html{height:100%}
body{margin:0;min-height:100%;display:grid;grid-template-rows:1fr auto;justify-items:center;padding:2.5rem 1.25rem 1.75rem;color:var(--fg);font-family:system-ui,-apple-system,"Segoe UI","Noto Sans Georgian","Noto Sans",sans-serif;line-height:1.6;-webkit-font-smoothing:antialiased;background:radial-gradient(60rem 34rem at 50% -8rem,var(--glow),transparent 70%),radial-gradient(40rem 26rem at 85% 110%,var(--glow2),transparent 70%),var(--bg);background-attachment:fixed}
main{align-self:center;width:100%;max-width:33rem;text-align:center}
.mark{position:relative;width:8.5rem;height:8.5rem;margin:0 auto 2rem;display:grid;place-items:center}
.mark::before,.mark::after{content:"";position:absolute;inset:0;border-radius:50%;border:1px solid var(--primary);opacity:0;animation:ring 4.5s ease-out infinite}
.mark::after{animation-delay:2.25s}
.mark img{position:relative;width:6.5rem;height:6.5rem;border-radius:50%;animation:float 6s ease-in-out infinite}
.status{display:inline-flex;align-items:center;gap:.55rem;margin:0 0 1.25rem;padding:.4rem .95rem;border:1px solid var(--border);border-radius:99rem;background:var(--card);color:var(--muted);font-size:.8rem;font-weight:600;letter-spacing:.04em}
.status::before{content:"";width:.5rem;height:.5rem;border-radius:50%;background:var(--primary);animation:pulse 2s ease-in-out infinite}
h1{margin:0 0 1rem;font-size:clamp(2.1rem,8vw,3.25rem);font-weight:700;line-height:1.1;letter-spacing:-.02em;text-wrap:balance}
.lead{margin:0 auto;max-width:27rem;color:var(--muted);font-size:1.075rem;text-wrap:pretty}
footer{margin-top:2.5rem;display:flex;flex-direction:column;align-items:center;gap:.6rem;color:var(--muted);font-size:.85rem}
nav{display:flex;flex-wrap:wrap;justify-content:center;gap:.25rem 1.1rem}
nav a{color:var(--muted);text-decoration:none}
nav a:hover{color:var(--primary)}
nav [aria-current]{color:var(--fg);font-weight:600}
a:focus-visible{outline:2px solid var(--primary);outline-offset:3px}
@keyframes ring{0%{transform:scale(.78);opacity:.45}100%{transform:scale(1.25);opacity:0}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
`.trim();

export function isMaintenanceOn(env: unknown) {
  return ON_VALUES.has(readString(env, "MAINTENANCE_MODE").toLowerCase());
}

export function maintenanceResponse(
  request: Request,
  env: unknown,
): null | Response {
  if (!isMaintenanceOn(env)) return null;

  const { pathname } = new URL(request.url);
  if (PASSTHROUGH_PATHS.has(pathname)) return null;
  if (isBypassed(request, env)) return null;

  const locale = localeFromPath(pathname);

  return new Response(
    request.method === "HEAD" ? null : maintenanceHtml(locale),
    {
      headers: {
        "Cache-Control": "no-store",
        "Content-Language": locale,
        "Content-Type": "text/html; charset=utf-8",
        [MAINTENANCE_HEADER]: "1",
        "Retry-After": String(MAINTENANCE_RETRY_AFTER_SECONDS),
      },
      status: 503,
    },
  );
}

function isBypassed(request: Request, env: unknown) {
  const token = readString(env, "MAINTENANCE_BYPASS_TOKEN");
  if (!token) return false;
  return (
    request.headers.get(MAINTENANCE_BYPASS_HEADER) === token ||
    readCookie(request, MAINTENANCE_BYPASS_COOKIE) === token
  );
}

function localeFromPath(pathname: string): MaintenanceLocale {
  const segment = pathname.split("/")[1];
  return segment === "en" || segment === "ru" || segment === "tr"
    ? segment
    : "ka";
}

function maintenanceHtml(locale: MaintenanceLocale) {
  const copy = COPY[locale];
  const links = LOCALES.map((entry) =>
    entry.locale === locale
      ? `<a href="${entry.href}" lang="${entry.locale}" aria-current="true">${entry.label}</a>`
      : `<a href="${entry.href}" lang="${entry.locale}" hreflang="${entry.locale}">${entry.label}</a>`,
  ).join("");

  return `<!doctype html>
<html lang="${locale}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="refresh" content="${REFRESH_SECONDS}">
<title>${copy.title}</title>
<style>${STYLE}</style>
</head>
<body>
<main>
<div class="mark"><img src="${LOGO_SRC}" alt="" width="104" height="104"></div>
<p class="status">${copy.status}</p>
<h1>${copy.heading}</h1>
<p class="lead">${copy.body}</p>
</main>
<footer><nav>${links}</nav><span>Reptiles.ge</span></footer>
</body>
</html>`;
}

function readCookie(request: Request, name: string) {
  const header = request.headers.get("cookie") ?? "";
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return rest.join("=");
  }
  return "";
}

function readString(env: unknown, key: string) {
  if (typeof env !== "object" || env === null) return "";
  const value = (env as Record<string, unknown>)[key];
  return typeof value === "string" ? value.trim() : "";
}
