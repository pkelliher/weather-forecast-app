# 5-Day Weather Forecast App

A Next.js application that displays a 5-day weather forecast in 3-hour increments for any US ZIP code. The app uses server-side rendering and shows dates/times in the user's local timezone.

## Live Demo

[https://weather-forecast-app-self-eight.vercel.app/](https://weather-forecast-app-self-eight.vercel.app/)

## Features

- Server-side rendered pages for fast loading
- 5-day forecast displayed in 3-hour increments
- Dynamic routing: `/weather/[zip]`
- Client-side ZIP validation with inline error messages
- Improved navigation using Next.js `<Link>` for internal pages
- Responsive design for desktop and mobile
- Built with TypeScript for type safety
- Global Error Handling: Displays a friendly error page for runtime errors
- Custom 404 Page: User-friendly page for invalid or unknown ZIP codes
- Updated header and UI enhancements for a more engaging experience

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- OpenWeather API (required for live forecasts)

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

3. Create `.env.local` and add your API key (optional):
   ```
   NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

### Running in Production

1. Build the app:
   ```bash
   npm run build
   ```
  
2. Start the server:
   ```bash
   npm start
   ```

### Running Tests

This project uses Jest and React Testing Library for unit and component tests.

To run all tests once:

```bash
npm test
```

To run tests in watch mode (reruns tests on file changes):
```bash
npm run test:watch
```

You should see output like:
```
PASS  __tests__/InvalidZipState.test.tsx
PASS  __tests__/Home.test.tsx
```

### Test Files

- `__tests__/Home.test.tsx` – Tests the home page ZIP input form.
- `__tests__/InvalidZipState.test.tsx` – Tests the invalid ZIP error state component.

## Usage

Visit `/weather/[zip]` to see the forecast for any US ZIP code.

Example: `/weather/94102` (San Francisco)

> **Note**: Enter a 5-digit US ZIP code. ZIP codes shorter than 5 digits show inline validation feedback. Valid-format but unknown ZIP codes render a friendly error state (404).

## API Reference

- [OpenWeather Geocoding API](https://openweathermap.org/api/geocoding-api)
- [OpenWeather 5-Day Forecast](https://openweathermap.org/forecast5)

## License

MIT
