import "./globals.css";
import { Providers } from "./providers";
import type { Metadata } from "next";
import AppNavBar from "@/components/navbar";
import Footer from "@/components/footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="border-x border-x-divider antialiased">
        <Providers>
          <div className="sticky top-0 z-50">
            <AppNavBar />
          </div>
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
