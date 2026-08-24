import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const sans = DM_Sans({ variable: "--font-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kitnets Beta | Jardim Conceição, São Roque",
  description: "Kitnets do seu jeito no Jardim Conceição, em São Roque.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Kitnets Beta",
    description: "Kitnets do seu jeito no Jardim Conceição, em São Roque.",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kitnets Beta",
    description: "Kitnets do seu jeito no Jardim Conceição, em São Roque.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={sans.variable}>{children}</body>
    </html>
  );
}
