# 5-Day Weather Forecast App

A Next.js application that displays a 5-day weather forecast in 3-hour increments for any US ZIP code.

## Live Demo

[https://weather-forecast-app-self-eight.vercel.app/](https://weather-forecast-app-self-eight.vercel.app/)

## Features

- Server-side rendered pages
- 5-day forecast in 3-hour increments
- Dynamic routing: `/weather/[zip]`
- Responsive design
- TypeScript

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- OpenWeather API

## Getting Started

### Prerequisites

- Node.js 18+ 
- OpenWeather API key ([Get one here](https://openweathermap.org/api))

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/pkelliher/weather-forecast-app.git
   cd weather-forecast-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local` and add your API key:
   ```
   NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Usage

Visit `/weather/[zip]` to see the forecast for any US ZIP code.

Example: `/weather/94102` (San Francisco)

## API Reference

- [OpenWeather Geocoding API](https://openweathermap.org/api/geocoding-api)
- [OpenWeather 5-Day Forecast](https://openweathermap.org/forecast5)

## License

MIT