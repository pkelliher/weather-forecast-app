import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          Page not found
        </h1>

        <p className="text-gray-600 mb-6">
          The page you’re looking for doesn’t exist or may have moved.
        </p>

        <Link
          href="/"
          className="inline-block text-blue-500 hover:underline text-sm"
        >
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
