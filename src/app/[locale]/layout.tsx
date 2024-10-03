import localFont from "next/font/local";
import "../globals.css";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { locales } from "../../navigation";
import Navbar from "@/components/navbar/navbar";
const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const vazirFont = localFont({
  src: "../fonts/Vazirmatn[wght].woff2",
});

import { Toaster } from "@/components/ui/toaster";
import Providers from "./providers";
import ReduxProvider from "@/store/providers";
export default function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  if (!locales.includes(locale)) {
    notFound();
  }

  const messages = useMessages();

  return (
    <html lang={locale}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <body className={`${vazirFont.className} antialiase`}>
          <ReduxProvider>
            <Providers>
              <Navbar locale={locale} />
              {children}
              <Toaster />
              <Sonner />
            </Providers>
          </ReduxProvider>
        </body>
      </NextIntlClientProvider>
    </html>
  );
}
