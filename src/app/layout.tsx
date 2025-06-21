import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { AuthProvider } from "../../context/auth";
import AuthNavLink from "@/components/AuthNavLink";
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
          <nav className="flex items-center justify-between bg-gray-50 p-5 h-24">
            <Link href="/">Discover Ease + LOGO</Link>
            <div className="flex items-center">
              <Link className="px-8 uppercase hover:underline" href="/">
                Home
              </Link>

              
              <AuthNavLink />
            </div>
          </nav>
          {children}
          <Toaster richColors closeButton/>
        </AuthProvider>
      </body>
    </html>
  );
}
