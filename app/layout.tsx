import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { WalletProvider } from "@/components/WalletProvider";
import { Toaster } from "@shelby-protocol/ui/components";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shelbook - Connect with friends and the world",
  description: "Shelbook is a social network built with Next.js, Supabase, and Shelby Protocol",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(() => {
  try {
    var key = 'shelby-theme';
    var stored = window.localStorage.getItem(key);
    var theme = stored === 'light' || stored === 'dark' ? stored : 'light';
    var root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  } catch (e) {}
})();`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WalletProvider>
        {children}
          <Toaster />
        </WalletProvider>
      </body>
    </html>
  );
}
