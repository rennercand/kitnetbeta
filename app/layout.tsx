import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const sans = DM_Sans({ variable: "--font-sans", subsets: ["latin"] });
const serif = Playfair_Display({ variable: "--font-serif", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kitnets Jardim Conceição | São Roque",
  description: "Kitnets no Jardim Conceição, em São Roque, com atendimento direto de Roni Fagundes e Barbara Aline.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Kitnets Jardim Conceição",
    description: "Seu espaço no Jardim Conceição, em São Roque.",
    type: "website",
    locale: "pt_BR",
    images: [{ url: "/og.png", width: 1731, height: 909, alt: "Kitnets Jardim Conceição" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kitnets Jardim Conceição",
    description: "Seu espaço no Jardim Conceição, em São Roque.",
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
