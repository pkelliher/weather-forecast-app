import { notFound } from "next/navigation";
import Link from "next/link";
import InvalidZipState from "../invalid-zip-state";

interface WeatherData {
  list: Array<{
    dt: number;
    dt_txt: string;
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
    };
    weather: Array<{
      description: string;
      main: string;
    }>;
    wind: {
      speed: number;
    };
  }>;
  city: {
    name: string;
  };
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

    return {
      cityName: name,
      list: forecastData.list,
    };
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

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {forecast.list.map((item) => (
            <div
              key={item.dt}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <p className="font-semibold text-lg text-gray-800">
                {new Date(item.dt * 1000).toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <p className="text-sm text-gray-600 mb-3">
                {new Date(item.dt * 1000).toLocaleTimeString(undefined, {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-4xl font-bold my-2 text-blue-600">
                {Math.round(item.main.temp)}°F
              </p>
              <p className="text-gray-700 capitalize font-medium">
                {item.weather[0].description}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-1 text-sm text-gray-600">
                <p>Feels like: {Math.round(item.main.feels_like)}°F</p>
                <p>Humidity: {item.main.humidity}%</p>
                <p>Wind: {Math.round(item.wind.speed)} mph</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
