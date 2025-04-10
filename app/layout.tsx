import { DataIdWatcher } from "@/components/data-id";
import AppNavBar from "@/components/navbar";
import { cn } from "@heroui/react";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

import "./globals.css";
import { Providers } from "./providers";

const serif = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-serif",
});

const sans = Inter({
  subsets: ["cyrillic"],
  variable: "--font-sans",
});

const mono = JetBrains_Mono({
  subsets: ["cyrillic"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          "border-x border-x-divider antialiased",
          serif.variable,
          sans.variable,
          mono.variable,
        )}
      >
        <Providers>
          <div className="sticky top-0 z-50">
            <NextTopLoader height={1} color="#AAFF00" showSpinner={false} />
            <AppNavBar />
          </div>
          <div>
            {children}
            <DataIdWatcher />
          </div>
        </Providers>
      </body>
    </html>
  );
}
