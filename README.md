# Weatherly

A clean, modern weather application built with good architecture and separation of concerns.

## Features

- Search weather by city
- Use current location
- Quick access to popular cities
- Live aircraft nearby using Flightradar24
- Beautiful dark modern UI
- Fully responsive

## Tech Stack

- Vanilla JavaScript (ES Modules)
- Tailwind CSS (via CDN for simplicity)
- Open-Meteo API
- Flightradar24 integration

## Project Structure

```
weather-app/
├── index.html          # Main HTML entry point
├── README.md
├── js/
│   ├── main.js           # App bootstrap & event listeners
│   ├── weather.js        # Weather service (API + formatting)
│   ├── aircraft.js       # Aircraft logic + Flightradar link
│   └── ui.js             # DOM rendering & UI helpers
├── styles/
│   └── main.css          # Custom styles
└── .gitignore
```

## Architecture

The app is split into small, focused modules:

- **`weather.js`** — Handles all weather-related logic (geocoding + current conditions)
- **`aircraft.js`** — Handles aircraft data and Flightradar24 integration
- **`ui.js`** — Responsible for updating the DOM
- **`main.js`** — Wires everything together

This makes the code much easier to maintain and extend.

## Getting Started

```bash
# Clone the repo
git clone https://github.com/mariustoft/weather-app.git
cd weather-app

# Open in browser (or use Live Server extension)
open index.html
```

## Deployment

This project is deployed on **Vercel** and automatically deploys on every push to `main`.

Live URL: https://weatherly-ten-alpha.vercel.app

## Future Roadmap

- [ ] Migrate to Next.js + TypeScript
- [ ] Add 7-day forecast
- [ ] Add favorite cities (localStorage)
- [ ] Add proper build setup (Tailwind + PostCSS)

## License

MIT