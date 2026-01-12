"use client";

import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            Something went wrong
          </h1>

          <p className="text-gray-600 mb-6">
            Please try again. If the problem continues, go back to the home page.
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => reset()}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              Try again
            </button>

            <Link href="/" className="text-blue-500 hover:underline text-sm">
              Back to home
            </Link>
          </div>

          <p className="text-xs text-gray-400 mt-6">{error.digest ?? ""}</p>
        </div>
      </body>
    </html>
  );
}
