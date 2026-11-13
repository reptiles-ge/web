export type SpeciesShareTarget = {
  href: string;
  id: SpeciesShareTargetId;
  label: string;
};

type SpeciesShareTargetId =
  "facebook" | "messenger" | "telegram" | "viber" | "whatsapp" | "x";

export function speciesShareTargets({
  text,
  url,
}: {
  text: string;
  url: string;
}): SpeciesShareTarget[] {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);
  const encodedMessage = encodeURIComponent(`${text}\n${url}`);
  return [
    {
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      id: "facebook",
      label: "Facebook",
    },
    {
      href: `fb-messenger://share/?link=${encodedUrl}`,
      id: "messenger",
      label: "Messenger",
    },
    {
      href: `https://wa.me/?text=${encodedMessage}`,
      id: "whatsapp",
      label: "WhatsApp",
    },
    {
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      id: "telegram",
      label: "Telegram",
    },
    {
      href: `viber://forward?text=${encodedMessage}`,
      id: "viber",
      label: "Viber",
    },
    {
      href: `https://x.com/intent/post?url=${encodedUrl}&text=${encodedText}`,
      id: "x",
      label: "X",
    },
  ];
}
