import { notFound } from "next/navigation";

export function assertLocalAdminPage() {
  if (!isLocalAdminEnabled()) notFound();
}

export function isLocalAdminEnabled() {
  return process.env.NODE_ENV !== "production" && !process.env.VERCEL;
}

export function localAdminForbiddenResponse() {
  return new Response(null, {
    headers: { "X-Robots-Tag": "noindex, nofollow" },
    status: 404,
  });
}
