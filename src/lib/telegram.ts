export type TelegramCredentials = {
  chatId?: string;
  token?: string;
};

export async function sendTelegramMessage(
  { chatId, token }: TelegramCredentials,
  text: string,
) {
  if (!token || !chatId) return "not_configured" as const;
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        body: JSON.stringify({ chat_id: chatId, text }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
        signal: AbortSignal.timeout(10000),
      },
    );
    const result = (await response.json()) as { ok?: boolean };
    return response.ok && result.ok ? ("sent" as const) : ("failed" as const);
  } catch {
    return "failed" as const;
  }
}
