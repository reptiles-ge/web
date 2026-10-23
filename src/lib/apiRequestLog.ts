const PREFIX = "[api-request]";

export function loggedFetch(base?: typeof fetch): typeof fetch {
  return async (input, init) => {
    const method =
      init?.method ?? (input instanceof Request ? input.method : "GET");
    const url = new URL(input instanceof Request ? input.url : String(input));
    const request = { body: bodyOf(init?.body), params: paramsOf(url) };
    const started = Date.now();
    try {
      const response = await (base ?? globalThis.fetch)(input, init);
      logGroup(
        `${PREFIX} ${method} ${url.href} → ${response.status} (${Date.now() - started} ms)`,
        { ...request, response: await responseOf(response.clone()) },
      );
      return response;
    } catch (error) {
      logGroup(
        `${PREFIX} ${method} ${url.href} → failed (${Date.now() - started} ms)`,
        { ...request, error },
      );
      throw error;
    }
  };
}

function bodyOf(body: BodyInit | null | undefined): unknown {
  if (body === undefined || body === null) return undefined;
  if (typeof body === "string") return parseText(body);
  if (body instanceof URLSearchParams) return paramsOf(body);
  if (body instanceof FormData) {
    const fields: Record<string, string> = {};
    for (const [key, value] of body) {
      fields[key] = typeof value === "string" ? value : `<file ${value.name}>`;
    }
    return fields;
  }
  if (body instanceof Blob) {
    return `<${body.type || "blob"}, ${body.size} bytes>`;
  }
  return `<${body.constructor.name}>`;
}

function logGroup(title: string, details: Record<string, unknown>) {
  const entries = Object.entries(details).filter(
    ([, value]) => value !== undefined,
  );
  if (typeof window === "undefined") {
    console.info(
      title,
      ...entries.flatMap(([label, value]) => [`\n  ${label}:`, value]),
    );
    return;
  }
  console.groupCollapsed(title);
  for (const [label, value] of entries) console.info(`${label}:`, value);
  console.groupEnd();
}

function paramsOf(source: URL | URLSearchParams) {
  const params = source instanceof URL ? source.searchParams : source;
  const entries: Record<string, string | string[]> = {};
  for (const key of new Set(params.keys())) {
    const values = params.getAll(key);
    entries[key] = values.length === 1 ? values[0] : values;
  }
  return Object.keys(entries).length > 0 ? entries : undefined;
}

function parseText(text: string): unknown {
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function responseOf(response: Response) {
  const type = response.headers.get("content-type") ?? "";
  if (type && !/json|text|xml/.test(type)) {
    const size = (await response.arrayBuffer()).byteLength;
    return `<${type}, ${size} bytes>`;
  }
  return parseText(await response.text());
}
