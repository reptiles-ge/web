const noindex = { "X-Robots-Tag": "noindex, nofollow" };

type AxeNodeReport = {
  target: string;
  html: string;
  summary: string;
};

type AxeViolationReport = {
  id: string;
  impact: string | null;
  help: string;
  helpUrl: string;
  nodes: AxeNodeReport[];
};

type AxeDevReport = {
  path?: string;
  event?: "active";
  violations?: AxeViolationReport[];
};

function clip(value: string, max = 160) {
  const compact = value.replace(/\s+/g, " ").trim();
  if (compact.length <= max) return compact;
  return `${compact.slice(0, max)}…`;
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return Response.json(
      { error: "Not found" },
      { status: 404, headers: noindex },
    );
  }

  let body: AxeDevReport;
  try {
    body = (await request.json()) as AxeDevReport;
  } catch {
    return Response.json(
      { error: "Invalid JSON" },
      { status: 400, headers: noindex },
    );
  }

  const path = body.path ?? "/";

  if (body.event === "active") {
    console.info(`[axe-core] WCAG 2.2 AA scanning  ${path}`);
    return new Response(null, { status: 204, headers: noindex });
  }

  const violations = body.violations ?? [];
  if (!violations.length) {
    return new Response(null, { status: 204, headers: noindex });
  }

  console.warn(`[axe-core] ${violations.length} rules  ${path}`);
  for (const violation of violations) {
    const impact = violation.impact ?? "unknown";
    console.warn(`  [${impact}] ${violation.id} ×${violation.nodes.length}`);
    const shown = violation.nodes.slice(0, 4);
    for (const node of shown) {
      console.warn(`    ${node.target}\n    ${clip(node.summary, 120)}`);
    }
    if (violation.nodes.length > shown.length) {
      console.warn(`    … +${violation.nodes.length - shown.length} more`);
    }
  }

  return new Response(null, { status: 204, headers: noindex });
}
