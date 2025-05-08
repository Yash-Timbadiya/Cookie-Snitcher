"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="bg-red-500/10 p-4 rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-14 w-14 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h2 className="mt-6 text-2xl font-semibold">Something went wrong!</h2>
      <p className="mt-2 text-gray-400 max-w-md mx-auto">
        We apologize for the inconvenience. Please try again or contact support
        if the problem persists.
      </p>
      <button
        onClick={() => reset()}
        className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
