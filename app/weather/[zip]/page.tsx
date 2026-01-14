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
  dataSource: "openweather" | "open-meteo";
};

function mapOpenMeteoWeatherCode(code: number) {
  if (code === 0) return { main: "Clear", description: "clear sky" };
  if (code === 1) return { main: "Clouds", description: "mainly clear" };
  if (code === 2) return { main: "Clouds", description: "partly cloudy" };
  if (code === 3) return { main: "Clouds", description: "overcast" };
  if (code === 45 || code === 48) return { main: "Fog", description: "fog" };
  if (code === 51) return { main: "Drizzle", description: "light drizzle" };
  if (code === 53) return { main: "Drizzle", description: "moderate drizzle" };
  if (code === 55) return { main: "Drizzle", description: "dense drizzle" };
  if (code === 56)
    return { main: "Drizzle", description: "light freezing drizzle" };
  if (code === 57)
    return { main: "Drizzle", description: "dense freezing drizzle" };
  if (code === 61) return { main: "Rain", description: "slight rain" };
  if (code === 63) return { main: "Rain", description: "moderate rain" };
  if (code === 65) return { main: "Rain", description: "heavy rain" };
  if (code === 66) return { main: "Rain", description: "light freezing rain" };
  if (code === 67) return { main: "Rain", description: "heavy freezing rain" };
  if (code === 71) return { main: "Snow", description: "slight snow" };
  if (code === 73) return { main: "Snow", description: "moderate snow" };
  if (code === 75) return { main: "Snow", description: "heavy snow" };
  if (code === 77) return { main: "Snow", description: "snow grains" };
  if (code === 80) return { main: "Rain", description: "slight rain showers" };
  if (code === 81)
    return { main: "Rain", description: "moderate rain showers" };
  if (code === 82) return { main: "Rain", description: "violent rain showers" };
  if (code === 85) return { main: "Snow", description: "slight snow showers" };
  if (code === 86) return { main: "Snow", description: "heavy snow showers" };
  if (code === 95) return { main: "Thunderstorm", description: "thunderstorm" };
  if (code === 96)
    return {
      main: "Thunderstorm",
      description: "thunderstorm with slight hail",
    };
  if (code === 99)
    return {
      main: "Thunderstorm",
      description: "thunderstorm with heavy hail",
    };
  return { main: "Unknown", description: "unknown conditions" };
}

async function getForecast(
  zip: string,
  apiKey?: string
): Promise<ForecastResult | null> {
  if (apiKey) {
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
        dataSource: "openweather",
      };
    } catch {}
  }

  const zipResponse = await fetch(`https://api.zippopotam.us/us/${zip}`, {
    next: { revalidate: 3600 },
  });
  if (!zipResponse.ok) return null;
  const zipData = (await zipResponse.json()) as {
    places: Array<{
      latitude: string;
      longitude: string;
      "place name": string;
      state: string;
    }>;
  };
  const place = zipData.places?.[0];
  if (!place) return null;
  const latitude = Number(place.latitude);
  const longitude = Number(place.longitude);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

  const meteoResponse = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&temperature_unit=fahrenheit&windspeed_unit=mph&forecast_days=5&timezone=auto`,
    { next: { revalidate: 600 } }
  );
  if (!meteoResponse.ok) return null;
  const meteoData = (await meteoResponse.json()) as {
    hourly: {
      time: string[];
      temperature_2m: number[];
      apparent_temperature: number[];
      relative_humidity_2m: number[];
      wind_speed_10m: number[];
      weather_code: number[];
    };
  };

  const times = meteoData.hourly?.time ?? [];
  const nowMs = Date.now();
  const firstFutureIndex = Math.max(
    0,
    times.findIndex((t) => new Date(t).getTime() >= nowMs)
  );

  const list: WeatherData["list"] = [];
  for (let i = firstFutureIndex; i < times.length && list.length < 40; i += 3) {
    const dt = new Date(times[i]);
    const condition = mapOpenMeteoWeatherCode(meteoData.hourly.weather_code[i]);
    list.push({
      dt: Math.floor(dt.getTime() / 1000),
      dt_txt: times[i],
      main: {
        temp: meteoData.hourly.temperature_2m[i],
        feels_like: meteoData.hourly.apparent_temperature[i],
        humidity: meteoData.hourly.relative_humidity_2m[i],
      },
      weather: [condition],
      wind: { speed: meteoData.hourly.wind_speed_10m[i] },
    });
  }

  return {
    cityName: `${place["place name"]}, ${place.state}`,
    list,
    dataSource: "open-meteo",
  };
}

export default async function WeatherPage({
  params,
}: {
  params: Promise<{ zip: string }>;
}) {
  const { zip } = await params;
  if (!/^\d{5}$/.test(zip)) notFound();
  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  let forecast: ForecastResult | null = null;
  try {
    forecast = await getForecast(zip, API_KEY);
  } catch {
    notFound();
  }
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
          {forecast.dataSource === "open-meteo" && (
            <p className="text-sm text-gray-500 mt-2">
              Showing forecast using a free data source. To use OpenWeather, set
              NEXT_PUBLIC_OPENWEATHER_API_KEY.
            </p>
          )}
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
                {new Date(item.dt * 1000).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <p className="text-sm text-gray-600 mb-3">
                {new Date(item.dt * 1000).toLocaleTimeString("en-US", {
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
