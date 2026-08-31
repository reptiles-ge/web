import { notFound } from "next/navigation";

export function isLocalAdminEnabled() {
  return process.env.NODE_ENV !== "production" && !process.env.VERCEL;
}

export function assertLocalAdminPage() {
  if (!isLocalAdminEnabled()) notFound();
}

export function localAdminForbiddenResponse() {
  return new Response(null, {
    status: 404,
    headers: { "X-Robots-Tag": "noindex, nofollow" },
  });
}
