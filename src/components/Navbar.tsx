"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-gradient-to-r to-red-950 from-black text-white py-6 px-6 shadow-lg border-b border-red-900/40">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-red-500 group-hover:text-red-200 transition-colors"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
            <path d="M8.5 8.5v.01" />
            <path d="M16 15.5v.01" />
            <path d="M12 12v.01" />
            <path d="M11 17v.01" />
            <path d="M7 14v.01" />
          </svg>
          <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r to-red-300 from-red-600">
            Cookie Snitcher
          </span>
        </Link>
        <div className="flex items-center space-x-6">
          <Link href="/" className="relative group">
            {pathname === "/" ? (
              <span className="text-xl font-semibold px-2 py-1 rounded transition-colors text-red-500">
                Dashboard
              </span>
            ) : (
              <span className="text-xl font-semibold px-2 py-1 rounded transition-colors text-white">
                Dashboard
              </span>
            )}
            <span className="absolute inset-x-0 bottom-0 h-1 bg-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
          </Link>
          <Link href="/about" className="relative group">
            {pathname === "/about" ? (
              <span className="text-xl font-semibold px-2 py-1 rounded transition-colors text-red-500">
                About
              </span>
            ) : (
              <span className="text-xl font-semibold px-2 py-1 rounded transition-colors text-white">
                About
              </span>
            )}
            <span className="absolute inset-x-0 bottom-0 h-1 bg-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
