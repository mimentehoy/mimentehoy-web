import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mimentehoy.com"),
  title: {
    default: "MIMENTEHOY | Ayuda clara para familias y neurodivergencia",
    template: "%s | MIMENTEHOY",
  },
  description:
    "MIMENTEHOY ofrece artículos, recursos prácticos, herramientas, newsletter y productos para familias, TDAH, autismo y salud mental.",
  applicationName: "MIMENTEHOY",
  keywords: [
    "TDAH",
    "autismo",
    "crianza",
    "salud mental",
    "hábitos",
    "sueño",
    "neurodivergencia",
    "familias",
    "recursos educativos",
  ],
  openGraph: {
    title: "MIMENTEHOY",
    description: "Contenido útil para familias, crianza, TDAH y neurodivergencia.",
    url: "https://mimentehoy.com",
    siteName: "MIMENTEHOY",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MIMENTEHOY",
    description: "Contenido útil para familias, crianza, TDAH y neurodivergencia.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
