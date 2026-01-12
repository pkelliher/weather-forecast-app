import Link from "next/link";

export default function InvalidZipState({ zip }: { zip: string }) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          ZIP code not found
        </h1>

        <p className="text-gray-600 mb-6">
          We couldn’t find weather data for{" "}
          <span className="font-mono font-medium">{zip}</span>.
        </p>

        <p className="text-sm text-gray-500 mb-6">
          Please enter a valid 5-digit US ZIP code or try one of the examples
          below.
        </p>

        <div className="flex gap-2 justify-center flex-wrap mb-6">
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

        <Link
          href="/"
          className="inline-block text-blue-500 hover:underline text-sm"
        >
          ← Back to search
        </Link>
      </div>
    </main>
  );
}
