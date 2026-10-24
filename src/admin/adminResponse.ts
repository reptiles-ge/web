type ErrorBody = {
  error?: { code?: string; details?: unknown; message?: string };
};

export class AdminSaveError extends Error {
  readonly code: string;
  readonly details: string[];

  constructor(code: string, message: string, details: string[]) {
    super(message);
    this.name = "AdminSaveError";
    this.code = code;
    this.details = details;
  }
}

export class SessionExpiredError extends Error {
  constructor() {
    super("Session expired");
    this.name = "SessionExpiredError";
  }
}

export function checkAdminResponse(
  response: { ok: boolean; status: number },
  failure: string,
) {
  if (response.status === 401 || response.status === 403) {
    throw new SessionExpiredError();
  }
  if (!response.ok) throw new Error(`${failure}: ${response.status}`);
}

export async function checkAdminSave(
  response: { json: () => Promise<unknown>; ok: boolean; status: number },
  failure: string,
) {
  checkAdminResponse({ ok: true, status: response.status }, failure);
  if (response.ok) return;
  const body = (await response.json().catch(() => ({}))) as ErrorBody;
  const code = body.error?.code ?? "unknown";
  throw new AdminSaveError(
    code,
    code === "version_conflict"
      ? "Someone saved a newer version. Reload the page, then make your change again."
      : (body.error?.message ?? `${failure}: ${response.status}`),
    Array.isArray(body.error?.details)
      ? body.error.details.map(detailText)
      : [],
  );
}

function detailText(detail: unknown) {
  if (!detail || typeof detail !== "object") return String(detail);
  const { message, path } = detail as { message?: unknown; path?: unknown };
  const where = Array.isArray(path) ? path.join(".") : path;
  return where ? `${String(where)}: ${String(message)}` : String(message);
}
