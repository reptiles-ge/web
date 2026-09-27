const counterUrl = "https://counter.top.ge/cgi-bin/count222?";
const localCounterUrl = "/api/dev/top-ge?";

export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return new Response(null, { status: 404 });
  }

  const url = new URL(request.url);
  const isScript = url.searchParams.has("script");
  const upstream = await fetch(
    isScript
      ? "https://counter.top.ge/counter.js"
      : `${counterUrl}${url.search.slice(1)}`,
    {
      cache: "no-store",
      headers: { Referer: "https://reptiles.ge/" },
    },
  );

  if (!upstream.ok) return new Response(null, { status: upstream.status });

  if (isScript) {
    const script = await upstream.text();
    if (!script.includes(counterUrl)) {
      return new Response(null, { status: 502 });
    }
    return new Response(script.replace(counterUrl, localCounterUrl), {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "application/javascript; charset=utf-8",
      },
    });
  }

  return new Response(upstream.body, {
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": upstream.headers.get("Content-Type") ?? "image/gif",
    },
  });
}
