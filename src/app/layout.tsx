import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { AuthProvider } from "../../context/auth";
import AuthNavLink from "@/components/auth-nav-link";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Discover ease",
  description: "Your travel experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <nav className="flex items-center justify-between x-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-70 h-24">
            <Link href="/">Discover Ease + LOGO</Link>
            <div className="flex items-center">
              <Link className="px-8 uppercase hover:underline" href="/">
                Home
              </Link>
              <Link className="px-8 uppercase hover:underline" href="/trend">
                Trend
              </Link>
              <AuthNavLink />
            </div>
          </nav>
          <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-70">
            {children}
          </div>
          <Toaster richColors closeButton />
        </AuthProvider>
      </body>
    </html>
  );
}
