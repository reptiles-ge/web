import type { Metadata } from "next";
import { Noto_Sans_Georgian, Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const notoSansGeorgian = Noto_Sans_Georgian({
  variable: "--font-noto-georgian",
  subsets: ["georgian"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Reptiles — აღმოაჩინე დედამიწის უძველესი არსებები",
  description:
    "ქვეწარმავლებისა და ამფიბიების ციფრული ენციკლოპედია. შეისწავლე ათასობით სახეობა მეცნიერებით, ფოტოგრაფიითა და AI იდენტიფიკაციით.",
  openGraph: {
    title: "Reptiles — აღმოაჩინე დედამიწის უძველესი არსებები",
    description:
      "ქვეწარმავლებისა და ამფიბიების ციფრული ენციკლოპედია. შეისწავლე ათასობით სახეობა მეცნიერებით, ფოტოგრაფიითა და AI იდენტიფიკაციით.",
    type: "website",
    locale: "ka_GE",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reptiles — აღმოაჩინე დედამიწის უძველესი არსებები",
    description:
      "ქვეწარმავლებისა და ამფიბიების ციფრული ენციკლოპედია. შეისწავლე ათასობით სახეობა მეცნიერებით, ფოტოგრაფიითა და AI იდენტიფიკაციით.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ka"
      className={`${sora.variable} ${notoSansGeorgian.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
