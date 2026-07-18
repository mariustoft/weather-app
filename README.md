# Weatherly

A clean, modern weather application that shows current weather conditions and nearby aircraft in real time.

## What it does

- Search weather for any city in the world
- Use your current location to get instant weather
- See live aircraft flying near the selected location
- Clean, fast, and mobile-friendly interface

## How it works

1. **Search or use location**
   - Type a city name and press Search, or tap "Use my current location".

2. **View weather**
   - Instantly see temperature, condition, feels like, humidity, and wind speed.

3. **See nearby planes**
   - The app automatically shows live aircraft near the location (when available).
   - You can tap to open the full map on Flightradar24.

## Data Sources

- Weather: [Open-Meteo](https://open-meteo.com) (free, no API key required)
- Aircraft: [OpenSky Network](https://opensky-network.org) + Flightradar24

## Tech

- Pure HTML + JavaScript (ES Modules)
- Custom CSS (no frameworks)
- Deployed on Vercel with instant updates from GitHub

## Live Demo

https://weatherly-ten-alpha.vercel.app

## Run locally

Just open `index.html` in any browser. No build step required.