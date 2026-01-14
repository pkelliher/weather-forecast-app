"use client";

import React from "react";

interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{ description: string }>;
  wind: { speed: number };
}

interface ForecastListProps {
  items: ForecastItem[];
}

export default function ForecastList({ items }: ForecastListProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
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
  );
}
