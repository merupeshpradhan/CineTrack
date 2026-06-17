import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ToastProvider from "@/components/ToastProvider";
import Footer from "@/components/Footer";

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
  title: "CineTrack — Personal Movie Watchlist Tracker",
  description: "Track, organize, and manage your custom cinema library collection logs seamlessly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" cz-shortcut-listen="true">
        {/* Global toast notification provider */}
        <ToastProvider />

        {/* Render page content */}
        {children}

        {/* Renders Everywhere IN My APPLICATION AUTOMATICALLY */}
        <Footer />
      </body>
    </html>
  );
}
