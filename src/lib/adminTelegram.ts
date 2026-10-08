import { serverEnv } from "@/lib/env";

export function formatAdminWorkflowProgress(value: unknown) {
  if (value === undefined) return "";
  if (
    !value ||
    typeof value !== "object" ||
    !("current" in value) ||
    !("total" in value) ||
    typeof value.current !== "number" ||
    typeof value.total !== "number" ||
    !Number.isInteger(value.current) ||
    !Number.isInteger(value.total) ||
    value.current < 1 ||
    value.current > value.total
  )
    throw new Error("Invalid workflow progress");
  return `${value.current}/${value.total} `;
}

export async function notifyAdminTelegram(message: string) {
  const { TELEGRAM_BOT_TOKEN: token, TELEGRAM_CHAT_ID: chatId } = serverEnv();
  if (!token || !chatId) {
    console.error("Admin Telegram is not configured");
    return;
  }
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        body: JSON.stringify({ chat_id: chatId, text: message }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
        signal: AbortSignal.timeout(10000),
      },
    );
    const result = (await response.json()) as { ok?: boolean };
    if (!response.ok || !result.ok)
      console.error("Admin Telegram notification failed");
  } catch {
    console.error("Admin Telegram notification failed");
  }
}
