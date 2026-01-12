"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const [zip, setZip] = useState("");
  const router = useRouter();

  const hasInput = zip.length > 0;
  const isValidZip = zip.length === 5;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (zip.length === 5) {
      router.push(`/weather/${zip}`);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">
          5-Day Weather Forecast
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Enter a US ZIP code to view the forecast
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={zip}
            onChange={(e) => setZip(e.target.value.replace(/\D/g, ""))}
            placeholder="Enter ZIP code (e.g., 94102)"
            maxLength={5}
            aria-describedby="zip-error"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
          />

          {hasInput && !isValidZip && (
            <p id="zip-error" className="text-sm text-red-500">
              ZIP code must be 5 digits
            </p>
          )}

          <button
            type="submit"
            disabled={!isValidZip}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition duration-200"
          >
            Get Forecast
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-2">Try these locations:</p>
          <div className="flex gap-2 justify-center flex-wrap">
            <Link
              href="/weather/94102"
              className="text-blue-500 hover:underline text-sm"
            >
              San Francisco
            </Link>
            <Link
              href="/weather/90210"
              className="text-blue-500 hover:underline text-sm"
            >
              Beverly Hills
            </Link>
            <Link
              href="/weather/10001"
              className="text-blue-500 hover:underline text-sm"
            >
              New York
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
