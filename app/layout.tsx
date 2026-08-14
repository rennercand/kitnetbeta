import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const sans = DM_Sans({ variable: "--font-sans", subsets: ["latin"] });
const serif = Playfair_Display({ variable: "--font-serif", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kitnets Beta | Jardim Conceição, São Roque",
  description: "Kitnets práticas para morar com tranquilidade no Jardim Conceição, em São Roque.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Kitnets Beta",
    description: "Kitnets práticas para morar com tranquilidade no Jardim Conceição, em São Roque.",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kitnets Beta",
    description: "Kitnets práticas para morar com tranquilidade no Jardim Conceição, em São Roque.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${sans.variable} ${serif.variable}`}>{children}</body>
    </html>
  );
}
