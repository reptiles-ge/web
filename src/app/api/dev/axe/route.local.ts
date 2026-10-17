const noindex = { "X-Robots-Tag": "noindex, nofollow" };

type AxeDevReport = {
  event?: "active";
  path?: string;
  violations?: AxeViolationReport[];
};

type AxeNodeReport = {
  html: string;
  summary: string;
  target: string;
};

type AxeViolationReport = {
  help: string;
  helpUrl: string;
  id: string;
  impact: null | string;
  nodes: AxeNodeReport[];
};

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return Response.json(
      { error: "Not found" },
      { headers: noindex, status: 404 },
    );
  }

  let body: AxeDevReport;
  try {
    body = (await request.json()) as AxeDevReport;
  } catch {
    return Response.json(
      { error: "Invalid JSON" },
      { headers: noindex, status: 400 },
    );
  }

  const path = clean(body.path ?? "/");

  if (body.event === "active") {
    console.info(`[axe-core] WCAG 2.2 AA scanning  ${path}`);
    return new Response(null, { headers: noindex, status: 204 });
  }

  const violations = body.violations ?? [];
  if (!violations.length) {
    return new Response(null, { headers: noindex, status: 204 });
  }

  console.warn(`[axe-core] ${violations.length} rules  ${path}`);
  for (const violation of violations) {
    const impact = clean(violation.impact ?? "unknown");
    console.warn(
      `  [${impact}] ${clean(violation.id)} ×${clean(violation.nodes.length)}`,
    );
    const shown = violation.nodes.slice(0, 4);
    for (const node of shown) {
      console.warn(`    ${clean(node.target)}\n    ${clip(node.summary, 120)}`);
    }
    if (violation.nodes.length > shown.length) {
      console.warn(`    … +${violation.nodes.length - shown.length} more`);
    }
  }

  return new Response(null, { headers: noindex, status: 204 });
}

function clean(value: unknown) {
  return String(value).replace(/[\u0000-\u001f\u007f]/g, "");
}

function clip(value: string, max = 160) {
  const compact = clean(value.replace(/\s+/g, " ")).trim();
  if (compact.length <= max) return compact;
  return `${compact.slice(0, max)}…`;
}
