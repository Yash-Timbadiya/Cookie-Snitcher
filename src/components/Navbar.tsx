import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="text-white py-4 px-6 shadow-md border-b-2 border-gray-700 border-dashed">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
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
          <span className="text-xl font-bold">Cookie Snitcher</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            Dashboard
          </Link>
          <Link href="/about" className="hover:text-gray-300 transition-colors">
            About
          </Link>
        </div>
      </div>
    </nav>
  );
}
