import { notFound } from "next/navigation";
import Link from "next/link";
import InvalidZipState from "../invalid-zip-state";
import ForecastList from "./ForecastList"; // use client component for display

interface WeatherData {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
    };
    weather: Array<{ description: string }>;
    wind: { speed: number };
  }>;
  city: { name: string };
}

type ForecastResult = {
  cityName: string;
  list: WeatherData["list"];
};

async function getForecast(
  zip: string,
  apiKey: string
): Promise<ForecastResult | null> {
  try {
    const geoResponse = await fetch(
      `https://api.openweathermap.org/geo/1.0/zip?zip=${zip},US&appid=${apiKey}`,
      { next: { revalidate: 3600 } }
    );
    if (!geoResponse.ok) return null;

    const { lat, lon, name } = (await geoResponse.json()) as {
      lat: number;
      lon: number;
      name: string;
    };

    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`,
      { next: { revalidate: 600 } }
    );
    if (!forecastResponse.ok) return null;

    const forecastData = (await forecastResponse.json()) as WeatherData;

    return { cityName: name, list: forecastData.list };
  } catch {
    return null;
  }
}

export default async function WeatherPage({
  params,
}: {
  params: Promise<{ zip: string }>;
}) {
  const { zip } = await params;
  if (!/^\d{5}$/.test(zip)) notFound();

  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  if (!API_KEY) throw new Error("OpenWeatherMap API key not set");

  const forecast = await getForecast(zip, API_KEY);
  if (!forecast) return <InvalidZipState zip={zip} />;

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <Link
            href="/"
            className="text-blue-500 hover:underline inline-flex items-center gap-2"
          >
            ← Back to search
          </Link>
          <h1 className="text-4xl font-bold mt-4 text-gray-800">
            {forecast.cityName}
          </h1>
          <p className="text-gray-600">ZIP Code: {zip}</p>
          <p className="text-sm text-gray-500 mt-2">
            🌤 Your 5-Day Weather Forecast 🌦 (3-hour intervals)
          </p>
        </div>

        {/* Client-rendered component formats the time in user's local timezone */}
        <ForecastList items={forecast.list} />
      </div>
    </main>
  );
}
