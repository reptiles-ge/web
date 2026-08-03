export const siteConfig = {
  name: "Reptiles",
  shortName: "Reptiles",
  title: "Reptiles — აღმოაჩინე დედამიწის უძველესი არსებები",
  description:
    "ქვეწარმავლებისა და ამფიბიების ციფრული ენციკლოპედია. შეისწავლე სახეობები მეცნიერებითა და ველში გადაღებული ფოტოგრაფიით.",
  locale: "ka_GE",
  language: "ka",
  keywords: [
    "ქვეწარმავლები",
    "ამფიბიები",
    "გველგესლა",
    "Vipera dinniki",
    "დინიკის გველგესლა",
    "გიურზა",
    "Macrovipera lebetina",
    "კავკასიური გველგესლა",
    "Vipera kaznakovi",
    "ცხვირრქოსანი გველგესლა",
    "Vipera ammodytes",
    "ენციკლოპედია",
    "ბიოლოგია",
    "კონსერვაცია",
    "Reptiles",
  ],
} as const;

export function getSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.VERCEL_PROJECT_PRODUCTION_URL;

  if (fromEnv) {
    const withProtocol = fromEnv.startsWith("http")
      ? fromEnv
      : `https://${fromEnv}`;
    return withProtocol.replace(/\/$/, "");
  }

  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  return "https://reptiles.ge";
}

export function absoluteUrl(path = "/") {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function absoluteImageUrl(src: string) {
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }
  return absoluteUrl(src);
}
