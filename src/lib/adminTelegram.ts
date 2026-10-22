import { serverEnv } from "@/lib/env";
import { sendTelegramMessage } from "@/lib/telegram";

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
  const status = await sendTelegramMessage({ chatId, token }, message);
  if (status === "not_configured") {
    console.error("Admin Telegram is not configured");
  } else if (status === "failed") {
    console.error("Admin Telegram notification failed");
  }
}
