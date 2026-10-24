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
