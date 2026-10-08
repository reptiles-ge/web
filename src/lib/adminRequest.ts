import {
  isLocalAdminEnabled,
  localAdminForbiddenResponse,
} from "@/lib/adminAccess";

const LOCAL_HOSTNAMES = ["127.0.0.1", "[::1]", "localhost"];

type AdminParsed<Key extends string, Value> =
  | ({ [K in Key]: Value } & { response?: undefined })
  | ({ [K in Key]?: undefined } & { response: Response });

export function adminErrorResponse(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;
  return adminInvalidResponse(message);
}

export function adminInvalidResponse(error: string) {
  return Response.json({ error }, { status: 400 });
}

export function isLocalAdminOriginRequest(request: Request) {
  const url = new URL(request.url);
  return (
    isLocalAdminEnabled() &&
    LOCAL_HOSTNAMES.includes(url.hostname) &&
    request.headers.get("origin") === url.origin
  );
}

export async function readAdminJsonText<T>(request: Request): Promise<T> {
  const text = await request.text();
  if (text.length > 1000) throw new Error("Invalid request");
  return JSON.parse(text) as T;
}

export function readBodyString(body: unknown, key: string) {
  if (!body || typeof body !== "object" || !(key in body)) return "";
  const value = (body as Record<string, unknown>)[key];
  return typeof value === "string" ? value.trim() : "";
}

export async function readLocalAdminFormData(
  request: Request,
): Promise<AdminParsed<"form", FormData>> {
  if (!isLocalAdminEnabled())
    return { response: localAdminForbiddenResponse() };
  try {
    return { form: await request.formData() };
  } catch {
    return { response: adminInvalidResponse("Invalid form") };
  }
}

export async function readLocalAdminJsonBody(
  request: Request,
): Promise<AdminParsed<"body", unknown>> {
  if (!isLocalAdminEnabled())
    return { response: localAdminForbiddenResponse() };
  try {
    return { body: await request.json() };
  } catch {
    return { response: adminInvalidResponse("Invalid JSON") };
  }
}
