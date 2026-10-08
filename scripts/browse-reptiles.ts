import { execFile, spawn } from "node:child_process";
import { promisify } from "node:util";

const exec = promisify(execFile);

const ORIGIN = "https://reptiles.ge";
const HOSTS = new Set(["reptiles.ge", "www.reptiles.ge"]);
const FILE =
  /\.(avif|css|gif|jpe?g|js|map|mjs|mp4|pdf|png|svg|webm|webp|woff2?|zip)(\?|#|$)/i;
const ANCHOR = /<a\b[^>]*?\shref\s*=\s*["']([^"']+)["']/gi;
const LOCALES = new Set(["en", "ru", "tr"]);
const SKIP = new Set([
  "about",
  "contact",
  "contributors",
  "kontributorebi",
  "privacy",
  "risk-to-humans",
  "riskis-doneebi",
  "terms-and-conditions",
]);
const META = new Set([...SKIP, "news", "quiz", "regions", "species"]);

const KEY = {
  console: 40,
  enter: 36,
  escape: 53,
  paste: 9,
} as const;

function pageLinks(hrefs: string[], here: string): string[] {
  const current = new URL(here);
  current.hash = "";
  const out: string[] = [];
  for (const raw of hrefs) {
    let url: URL;
    try {
      url = new URL(raw, here);
    } catch {
      continue;
    }
    if (url.protocol !== "http:" && url.protocol !== "https:") continue;
    if (!HOSTS.has(url.hostname)) continue;
    if (url.pathname.startsWith("/_next/")) continue;
    if (FILE.test(url.pathname)) continue;
    url.hash = "";
    const href = url.toString();
    if (href === current.toString() || out.includes(href)) continue;
    out.push(href);
  }
  return out;
}

function hrefsIn(html: string) {
  return [...html.matchAll(ANCHOR)].map((match) => match[1] ?? "");
}

function sliceTag(html: string, tag: string) {
  const lower = html.toLowerCase();
  const start = lower.indexOf(`<${tag}`);
  const end = lower.indexOf(`</${tag}>`, start);
  if (start < 0 || end < start) return "";
  return html.slice(start, end);
}

function segments(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] && LOCALES.has(parts[0])) parts.shift();
  return parts;
}

function localeOf(pathname: string) {
  const first = pathname.split("/").filter(Boolean)[0];
  return first && LOCALES.has(first) ? first : "ka";
}

function chooseNext(
  here: string,
  header: string[],
  main: string[],
  steps: number,
  last: string | null,
  random: () => number,
) {
  const hereUrl = new URL(here);
  const hereParts = segments(hereUrl.pathname);
  const hereSection = hereParts[0] ?? "";
  const keep = (raw: string) => {
    const [href] = pageLinks([raw], here);
    if (!href) return null;
    const path = new URL(href).pathname;
    if (localeOf(path) !== localeOf(hereUrl.pathname)) return null;
    const [section] = segments(path);
    if (section && SKIP.has(section)) return null;
    if (href === last) return null;
    return href;
  };
  const unique = (hrefs: string[]) => [...new Set(hrefs)];
  const headerLinks = unique(header.map(keep).filter((href) => href !== null));
  const mainLinks = unique(main.map(keep).filter((href) => href !== null));
  const depth = (href: string) => segments(new URL(href).pathname).length;
  const sectionOf = (href: string) => segments(new URL(href).pathname)[0] ?? "";
  const deeper = mainLinks.filter(
    (href) => sectionOf(href) === hereSection && depth(href) > hereParts.length,
  );
  const related = mainLinks.filter(
    (href) => sectionOf(href) === hereSection && depth(href) >= 2,
  );
  const groupHubs = mainLinks.filter((href) => {
    const section = sectionOf(href);
    return depth(href) === 1 && section !== "" && !META.has(section);
  });
  const exits = headerLinks.filter((href) => {
    const section = sectionOf(href);
    return depth(href) === 1 && section !== hereSection && !SKIP.has(section);
  });
  const pick = (hrefs: string[]) =>
    hrefs.length === 0
      ? null
      : (hrefs[Math.floor(random() * hrefs.length)] ?? null);

  if (hereParts.length === 0) return pick(groupHubs) ?? pick(exits);
  if (steps < 1 && deeper.length > 0) return pick(deeper);
  if (steps < 2 && related.length > 0) return pick(related);
  if (deeper.length > 0) return pick(deeper);
  return pick(exits) ?? pick(related);
}

function assertRoute() {
  const home = "https://reptiles.ge/";
  const header = ["/species", "/quiz", "/regions", "/news", "/about"];
  const main = [
    "/gvelebi",
    "/xvlikebi",
    "/gvelebi/giurza",
    "/news/story",
    "/about",
  ];
  const zero = () => 0;
  const hub = chooseNext(home, header, main, 0, null, zero);
  if (hub !== "https://reptiles.ge/gvelebi") throw new Error(`home → ${hub}`);

  const child = chooseNext(
    "https://reptiles.ge/gvelebi",
    header,
    ["/gvelebi/giurza", "/_next/static/app.js", "/about"],
    0,
    hub,
    zero,
  );
  if (child !== "https://reptiles.ge/gvelebi/giurza") {
    throw new Error(`hub → ${child}`);
  }

  const related = chooseNext(
    child,
    header,
    ["/gvelebi/saxsovani", "/gvelebi", "/privacy"],
    1,
    child,
    zero,
  );
  if (related !== "https://reptiles.ge/gvelebi/saxsovani") {
    throw new Error(`species → ${related}`);
  }

  const exit = chooseNext(
    related,
    header,
    ["/gvelebi/saxsovani"],
    2,
    related,
    zero,
  );
  if (exit !== "https://reptiles.ge/species") throw new Error(`exit → ${exit}`);

  const html =
    '<header><a href="/species"></a><a href="/about"></a></header><main><a href="/gvelebi"></a></main><footer><a href="/privacy"></a></footer>';
  const fromHtml = chooseNext(
    home,
    hrefsIn(sliceTag(html, "header")),
    hrefsIn(sliceTag(html, "main")),
    0,
    null,
    zero,
  );
  if (fromHtml !== "https://reptiles.ge/gvelebi")
    throw new Error(`html → ${fromHtml}`);
  const reading = scrollPlan(() => 0);
  if (reading.ms < 4000 || !reading.source.includes("scrollBy(0,")) {
    throw new Error("scroll plan");
  }
  if (clickSource("/gvelebi").includes("scrollIntoView")) {
    throw new Error("click jumps the page");
  }
  const literal = sourceLiteral("/a</script>\u2028");
  if (
    /[<>/\u2028]/.test(literal) ||
    JSON.parse(literal) !== "/a</script>\u2028"
  ) {
    throw new Error("source literal");
  }
}

function between(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function wait(ms: number, stopped: () => boolean) {
  return new Promise<void>((resolve) => {
    const end = Date.now() + ms;
    const tick = () => {
      if (stopped() || Date.now() >= end) resolve();
      else setTimeout(tick, 200);
    };
    tick();
  });
}

function clipboard(text: string) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn("pbcopy");
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`pbcopy exited ${code}`));
    });
    child.stdin.end(text);
  });
}

function onSite(href: string) {
  try {
    return HOSTS.has(new URL(href).hostname);
  } catch {
    return false;
  }
}

async function keys(script: string) {
  try {
    await exec("osascript", ["-e", script]);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("1002") || message.includes("not allowed")) {
      throw new Error(
        "Allow Cursor or Terminal to control Firefox: System Settings → Privacy & Security → Accessibility.",
      );
    }
    throw error;
  }
}

async function inPage(source: string) {
  const saved = await exec("pbpaste")
    .then((result) => result.stdout)
    .catch(() => "");
  await clipboard(source);
  try {
    await keys(`tell application "Firefox" to activate
delay 0.3
tell application "System Events"
  key code ${KEY.escape}
  delay 0.15
  key code ${KEY.console} using {command down, option down}
  delay 0.7
  key code ${KEY.paste} using {command down}
  delay 0.2
  key code ${KEY.enter}
  delay 0.5
  key code ${KEY.console} using {command down, option down}
end tell`);
    return (await exec("pbpaste")).stdout.trim();
  } finally {
    await clipboard(saved);
  }
}

const UNSAFE_IN_SOURCE = /[<>/\u2028\u2029]/g;

function sourceLiteral(value: string) {
  return JSON.stringify(value).replace(
    UNSAFE_IN_SOURCE,
    (char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`,
  );
}

function clickSource(pathname: string) {
  const path = sourceLiteral(pathname);
  return `(() => { const path = ${path}; const links = [...document.querySelectorAll("main a[href]"), ...document.querySelectorAll("header a[href]")]; const link = links.find((a) => { try { return new URL(a.href).pathname.replace(/\\/$/, "") === path; } catch (e) { return false; } }); if (!link || link.target === "_blank") { copy("MISS"); return; } link.click(); copy(link.href); })()`;
}

function scrollPlan(random: () => number) {
  const bursts = 4 + Math.floor(random() * 3);
  let ms = 0;
  const steps: string[] = [];
  for (let burst = 0; burst < bursts; burst += 1) {
    const ticks = 3 + Math.floor(random() * 4);
    for (let tick = 0; tick < ticks; tick += 1) {
      const dy = Math.round((random() < 0.12 ? -1 : 1) * (28 + random() * 44));
      const gap = Math.round(70 + random() * 110);
      ms += gap;
      steps.push(`go(${dy});await wait(${gap});`);
    }
    const pause = Math.round(900 + random() * 1500);
    ms += pause;
    steps.push(`await wait(${pause});`);
  }
  return {
    ms,
    source: `(()=>{document.documentElement.style.scrollBehavior="auto";const wait=(n)=>new Promise((r)=>setTimeout(r,n));const go=(dy)=>{const max=document.documentElement.scrollHeight-innerHeight;if(window.scrollY<max-2)window.scrollBy(0,dy);};(async()=>{${steps.join("")}})();copy("ok");})()`,
  };
}

async function readPage(stopped: () => boolean) {
  const plan = scrollPlan(Math.random);
  const started = await inPage(plan.source);
  if (started !== "ok") throw new Error("Could not scroll the page.");
  await wait(plan.ms, stopped);
}

async function main() {
  assertRoute();
  if (process.argv.includes("--check")) return;

  const cap = Number(process.argv.find((arg) => /^\d+$/.test(arg)) ?? "0");
  let stop = false;
  process.on("SIGINT", () => {
    stop = true;
  });

  let here = await inPage("copy(location.href)");
  if (!here.startsWith("http")) {
    throw new Error("Firefox console did not return the page address.");
  }
  if (!onSite(here)) {
    await exec("open", ["-a", "Firefox", ORIGIN]);
    await wait(between(1500, 2500), () => stop);
    here = ORIGIN;
  }

  let steps = 0;
  let section = segments(new URL(here).pathname)[0] ?? "";
  let last: string | null = null;
  let seen = 1;
  console.log(here);

  while (!stop && (cap === 0 || seen < cap)) {
    await readPage(() => stop);
    if (stop) break;

    const response = await fetch(here);
    const html = await response.text();
    const next = chooseNext(
      response.url || here,
      hrefsIn(sliceTag(html, "header")),
      hrefsIn(sliceTag(html, "main")),
      steps,
      last,
      Math.random,
    );
    if (!next) break;

    const clicked = await inPage(
      clickSource(new URL(next).pathname.replace(/\/$/, "")),
    );
    if (!onSite(clicked)) throw new Error(`Link was not on the page: ${next}`);

    const nextSection = segments(new URL(clicked).pathname)[0] ?? "";
    steps = nextSection === section ? steps + 1 : 0;
    section = nextSection;
    last = here;
    here = clicked;
    seen += 1;
    console.log(here);
    await wait(between(1200, 2200), () => stop);
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
