import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

import {
  formatVisitMessage,
  readVisitPath,
  VISIT_COOKIE,
  visitClientIp,
  visitLimiter,
  visitOriginAllowed,
} from "@/lib/visitNotify";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const noindex = { "X-Robots-Tag": "noindex, nofollow" };
const cookieMaxAge = 60 * 60 * 24 * 365;

export async function POST(request: NextRequest) {
  if (!visitOriginAllowed(request, request.nextUrl)) {
    return empty();
  }

  const jar = await cookies();
  if (jar.get(VISIT_COOKIE)?.value === "1") {
    return empty();
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return empty();
  }

  const visit = readVisitPath(body);
  if (!visit) return empty();

  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  if (!token || !chatId) {
    await markNotified();
    return empty();
  }

  if (!visitLimiter.take(visitClientIp(request))) {
    await markNotified();
    return empty();
  }

  const sent = await sendTelegramMessage({
    chatId,
    text: formatVisitMessage(visit),
    token,
  });
  if (!sent) {
    return new NextResponse(null, { headers: noindex, status: 503 });
  }

  await markNotified();
  return empty();
}

function empty() {
  return new NextResponse(null, { headers: noindex, status: 204 });
}

async function markNotified() {
  const jar = await cookies();
  jar.set(VISIT_COOKIE, "1", {
    httpOnly: true,
    maxAge: cookieMaxAge,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

async function sendTelegramMessage(input: {
  chatId: string;
  text: string;
  token: string;
}) {
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${input.token}/sendMessage`,
      {
        body: JSON.stringify({
          chat_id: input.chatId,
          disable_web_page_preview: true,
          text: input.text,
        }),
        headers: { "content-type": "application/json" },
        method: "POST",
        signal: AbortSignal.timeout(8_000),
      },
    );
    return response.ok;
  } catch {
    return false;
  }
}
