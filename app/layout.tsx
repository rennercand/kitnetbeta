import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const sans = DM_Sans({ variable: "--font-sans", subsets: ["latin"] });
const serif = Playfair_Display({ variable: "--font-serif", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Beta Kitnets | Direto com o proprietário",
  description: "Kitnets práticas, bem cuidadas e com negociação direta com o proprietário.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Beta Kitnets",
    description: "Seu espaço. Do seu jeito. Aluguel direto com o proprietário.",
    type: "website",
    locale: "pt_BR",
    images: [{ url: "/og.png", width: 1731, height: 909, alt: "Beta Kitnets" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Beta Kitnets",
    description: "Seu espaço. Do seu jeito. Aluguel direto com o proprietário.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${sans.variable} ${serif.variable}`}>{children}</body>
    </html>
  );
}
