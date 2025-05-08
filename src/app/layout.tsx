import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
        className={`${geistSans.variable} ${geistMono.variable} h-screen antialiased`}
      >
        <div className="relative flex flex-col min-h-screen overflow-hidden transition-colors duration-300 bg-gradient-to-tr to-red-950 from-black">
          <div className="bg-transparent">
            <Navbar />
          </div>
          <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
          {/* <main className="container mx-auto px-4 py-8"></main> */}
          <Footer />
        </div>
      </body>
    </html>
  );
}
