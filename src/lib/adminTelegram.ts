export async function notifyAdminTelegram(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
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
