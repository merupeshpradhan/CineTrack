import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import ToastProvider from "@/app/components/ToastProvider";

// Configure application fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Global application metadata
export const metadata: Metadata = {
  title: "Movie Watchlist",
  description: "Track, organize, and manage your personal movie collection.",
};

// Root layout shared across the entire application
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Global toast notification provider */}
        <ToastProvider />

        {/* Render page content */}
        {children}
      </body>
    </html>
  );
}
