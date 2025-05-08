import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cookie Snitcher - Track and Monitor Browser Cookies",
  description:
    "A modern web app to track and display cookies captured by the Cookie Snitcher Chrome Extension",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-950 text-gray-100`}
      >
        <Navbar />
        <main className="container mx-auto px-4 py-8">{children}</main>
        <footer className="bg-gray-900 text-gray-400 text-center py-6">
          <div className="container mx-auto">
            <p>
              © {new Date().getFullYear()} Cookie Snitcher. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
