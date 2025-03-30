import "./globals.css";
import { Providers } from "./providers";
import type { Metadata } from "next";
import AppNavBar from "@/components/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="container mx-auto border-x border-x-divider antialiased">
        <Providers>
          <div className="sticky top-0">
            <AppNavBar />
          </div>
          {children}
        </Providers>
      </body>
    </html>
  );
}
